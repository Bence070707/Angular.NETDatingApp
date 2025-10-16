using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using API.Entities.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(AppDbContext database, IJWTService jwtService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await EmailExists(registerDTO.Email))
            {
                return BadRequest("Email is already taken");
            }

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    DisplayName = registerDTO.DisplayName,
                    Gender = registerDTO.Gender,
                    Country = registerDTO.Country,
                    City = registerDTO.City,
                    DateOfBirth = registerDTO.DateOfBirth
                }
            };

            database.Users.Add(user);
            database.SaveChanges();

            return user.AsUserDTO(jwtService.CreateToken(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await database.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == loginDTO.Email.ToLower());
            if (user is null) return NotFound("Account not present in the database.");

            if (!PasswordMatch(user.PasswordSalt, user.PasswordHash, loginDTO.Password))
            {
                return Unauthorized("Invalid password");
            }

            return user.AsUserDTO(jwtService.CreateToken(user));
        }

        private static bool PasswordMatch(byte[] key, byte[] dbPassword, string usrPassword)
        {
            using var hmac = new HMACSHA512(key);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(usrPassword));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != dbPassword[i])
                {
                    return false;
                }
            }
            return true;
        }

        private async Task<bool> EmailExists(string email)
        {
            return await database.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
    }
}
