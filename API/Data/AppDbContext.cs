using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> opts) : DbContext(opts)
{
    public DbSet<AppUser> Users { get; set; } = default!;
    public DbSet<Member> Members { get; set; } = default!;
    public DbSet<Photo> Photos { get; set; } = default!;
}
