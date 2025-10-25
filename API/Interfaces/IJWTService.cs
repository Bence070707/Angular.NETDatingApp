using System;
using API.Entities;

namespace API.Interfaces;

public interface IJWTService
{
    Task<string> CreateToken(AppUser user);
    string GenerateRefreshToken();
}
