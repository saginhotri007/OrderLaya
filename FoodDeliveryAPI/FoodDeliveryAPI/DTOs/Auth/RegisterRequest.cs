namespace FoodDeliveryAPI.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Customer, Restaurant, Delivery, Admin
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}