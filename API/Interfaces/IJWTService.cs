using System;
using API.Entities;

namespace API.Interfaces;

public interface IJWTService
{
    string CreateToken(AppUser user);
}
