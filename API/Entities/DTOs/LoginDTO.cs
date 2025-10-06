using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities.DTOs;

public class LoginDTO
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [StringLength(16, MinimumLength = 6)]
    public required string Password { get; set; }
}
