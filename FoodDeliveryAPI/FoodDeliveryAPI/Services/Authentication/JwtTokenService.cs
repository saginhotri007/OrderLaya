using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _config;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _key;
        private readonly int _expiresMinutes;

        public JwtTokenService(IConfiguration config)
        {
            _config = config;
            var section = _config.GetSection("Jwt");
            _issuer = section["Issuer"] ?? "FoodDeliveryAPI";
            _audience = section["Audience"] ?? "FoodDeliveryClient";
            _key = section["Key"] ?? throw new InvalidOperationException("Jwt:Key must be configured");
            _expiresMinutes = int.TryParse(section["ExpiresMinutes"], out var m) ? m : 120;
        }

        public string GenerateToken(User user, out DateTime expiresAt)
        {
            var keyBytes = Encoding.UTF8.GetBytes(_key);
            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            expiresAt = DateTime.UtcNow.AddMinutes(_expiresMinutes);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "Customer")
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
