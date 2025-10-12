namespace FoodDeliveryAPI.DTOs.Auth
{
    public class LoginRequest
    {
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    public class VerifyOtpRequest
    {
        public string Phone { get; set; }
        public string Otp { get; set; }
    }
}