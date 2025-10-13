using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class RegisterDTO
    {
        [Required]
        public string DisplayName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(16, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
    }
}
