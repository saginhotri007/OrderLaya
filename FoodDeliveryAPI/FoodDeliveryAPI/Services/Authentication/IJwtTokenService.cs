using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Services
{
    public interface IJwtTokenService
    {
        /// <summary>
        /// Generate a JWT token string for the given user and return the token and expiry.
        /// </summary>
        string GenerateToken(FoodDeliveryAPI.Models.User user, out DateTime expiresAt);
    }
}
