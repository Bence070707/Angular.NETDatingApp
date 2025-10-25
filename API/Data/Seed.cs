using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userText = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var users = JsonSerializer.Deserialize<List<SeedUserDto>>(userText);

        if (users == null) return;

        foreach (var user in users)
        {
            var newUser = new AppUser
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                UserName = user.Email,
                ImageUrl = user.ImageUrl,
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

            var result = await userManager.CreateAsync(newUser, "Pa$$w0rd");

            if (!result.Succeeded)
            {
                System.Console.WriteLine("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await userManager.AddToRoleAsync(newUser, "Member");
        }

        var admin = new AppUser
        {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            DisplayName = "Admin"
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
