namespace FoodDeliveryAPI.DTOs.Users
{
    public class UserDto
    {
        public int UserID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = "Customer";
        public string? Address { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
