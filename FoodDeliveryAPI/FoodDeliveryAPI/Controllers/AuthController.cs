using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Interfaces.User;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsersRepository _usersRepo;
    private readonly PasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;

    public AuthController(IUsersRepository usersRepo, PasswordHasher hasher, IJwtTokenService jwt)
    {
        _usersRepo = usersRepo;
        _hasher = hasher;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        var existing = await _usersRepo.GetByEmailAsync(req.Email);
        if (existing != null) return Conflict("Email already exists");

        var user = new FoodDeliveryAPI.Models.User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = _hasher.Hash(req.Password),
            Phone = req.Phone,
            Role = req.Role,
            Address = req.Address
        };

        var newId = await _usersRepo.CreateUserAsync(user);
        user.UserID = newId;

        var token = _jwt.GenerateToken(user, out var expiresAt);

        return Ok(new
        {
            token,
            expiresAt,
            user = new { user.UserID, user.Name, user.Email, user.Role }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await _usersRepo.GetByEmailAsync(req.Phone);
        if (user == null) return Unauthorized("Invalid credentials");
        if (!_hasher.Verify(req.Password, user.PasswordHash)) return Unauthorized("Invalid credentials");

        var token = _jwt.GenerateToken(user, out var expiresAt);

        return Ok(new
        {
            token,
            expiresAt,
            user = new { user.UserID, user.Name, user.Email, user.Role }
        });
    }
}
