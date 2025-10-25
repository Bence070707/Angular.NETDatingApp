using System;
using System.Runtime.ConstrainedExecution;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> opts) : IdentityDbContext<AppUser>(opts)
{
    public DbSet<Member> Members { get; set; } = default!;
    public DbSet<Photo> Photos { get; set; } = default!;
    public DbSet<MemberLike> Likes { get; set; } = default!;
    public DbSet<Message> Messages { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole { Id = "member-id", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "moderator-id", Name = "Moderator", NormalizedName = "MODERATOR" },
            new IdentityRole { Id = "admin-id", Name = "Admin", NormalizedName = "ADMIN" }
        );

        builder.Entity<MemberLike>()
            .HasKey(ml => new { ml.SourceMemberId, ml.TargetMemberId });

        builder.Entity<MemberLike>()
            .HasOne(s => s.SourceMember)
            .WithMany(t => t.LikedMembers)
            .HasForeignKey(s => s.SourceMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MemberLike>()
            .HasOne(s => s.TargetMember)
            .WithMany(t => t.LikedByMembers)
            .HasForeignKey(s => s.TargetMemberId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
        .HasOne(x => x.Sender)
        .WithMany(m => m.MessagesSent)
        .OnDelete(DeleteBehavior.Restrict);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            d => d.ToUniversalTime(),
            d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
            d => d.HasValue ? d.Value.ToUniversalTime() : null,
            d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var properties = entityType.GetProperties();

            foreach (var property in properties)
            {

                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(nullableDateTimeConverter);
                }
            }
        }
    }
}
