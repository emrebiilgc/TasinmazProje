namespace TasinmazProje.Presentation.Dtos
{
    public class UserCreateDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "User";
        public string Address { get; set; } = "";
    }
}