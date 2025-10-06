using System;
using API.Entities;
using API.Entities.DTOs;

namespace API.Extensions;

public static class AppUser2UserDTO
{
    public static UserDTO AsUserDTO(this AppUser loginDTO, string token)
    {
        ArgumentNullException.ThrowIfNull(loginDTO);
        return new UserDTO
        {
            Id = loginDTO.Id,
            DisplayName = loginDTO.DisplayName,
            Email = loginDTO.Email,
            Token = token
        };
    }
}
