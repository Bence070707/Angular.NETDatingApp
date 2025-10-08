using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var userText = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var users = JsonSerializer.Deserialize<List<SeedUserDto>>(userText);

        if (users == null) return;
        
        foreach (var user in users)
        {
            using var hmac = new HMACSHA512();
            var newUser = new AppUser
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                ImageUrl = user.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Description = user.Description,
                    DateOfBirth = user.DateOfBirth,
                    ImageUrl = user.ImageUrl,
                    Gender = user.Gender,
                    City = user.City,
                    Country = user.Country,
                    LastActive = user.LastActive,
                    Created = user.Created,
                }

            };

            newUser.Member.Photos.Add(new Photo
            {
                Url = user.ImageUrl!,
                PublicId = null,
                MemberId = user.Id
            });

            await context.Users.AddAsync(newUser);
        }

        await context.SaveChangesAsync();
    }
}
