using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class RegisterDTO
    {
        [Required]
        public required string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 6)]
        public required string Password { get; set; }
    }
}
