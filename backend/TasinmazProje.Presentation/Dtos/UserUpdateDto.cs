namespace TasinmazProje.Presentation.Dtos
{
    public class UserUpdateDto
    {
        public int Id { get; set; } 
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Address { get; set; } = "";
    }
}