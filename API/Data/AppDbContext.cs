using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> opts) : DbContext(opts)
{
    public DbSet<AppUser> Users { get; set; } = default!;
    public DbSet<Member> Members { get; set; } = default!;
    public DbSet<Photo> Photos { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            d => d.ToUniversalTime(),
            d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        foreach(var entityType in builder.Model.GetEntityTypes())
        {
            var properties = entityType.GetProperties();

            foreach(var property in properties)
            {
                
                if(property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
