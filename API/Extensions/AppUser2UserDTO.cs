using System;
using API.Entities;
using API.Entities.DTOs;
using API.Interfaces;

namespace API.Extensions;

public static class AppUser2UserDTO
{
    public async static Task<UserDTO> AsUserDTO(this AppUser loginDTO, IJWTService jWTService)
    {
        ArgumentNullException.ThrowIfNull(loginDTO);
        return new UserDTO
        {
            Id = loginDTO.Id,
            DisplayName = loginDTO.DisplayName,
            Email = loginDTO.Email!,
            Token = await jWTService.CreateToken(loginDTO),
            ImageUrl = loginDTO.ImageUrl
        };
    }
}
