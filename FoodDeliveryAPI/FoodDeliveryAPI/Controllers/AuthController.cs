using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Interfaces.User;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsersRepository _usersRepo;
    private readonly PasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;
    private readonly IConfiguration _configuration;

    public AuthController(IUsersRepository usersRepo, PasswordHasher hasher, IJwtTokenService jwt, IConfiguration configuration)
    {
        _usersRepo = usersRepo;
        _hasher = hasher;
        _jwt = jwt;
        _configuration = configuration;
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

    [HttpPost("generate-otp")]
    public async Task<IActionResult> GenerateOtp(LoginRequest req)
    {
        var user = await _usersRepo.GetByEmailAsync(req.Phone);
        if (user == null)
        {
            return Unauthorized("Invalid phone number");
        }
   
        // Generate OTP
        var otp = GenerateRandomOtp();
        // Save OTP in database or cache for verification
        // For demonstration purposes, we'll store it in a static variable
        HttpContext.Session.SetString("otp", otp);

        // Send OTP via SMS using Twilio
        if (user.Phone != null)
        {
            SendOtpViaSms(user.Phone, otp);
            //Add whatsapp option here

        }

        return Ok("OTP sent successfully");

    }
    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] string otp)
    {
        var storedOtp = HttpContext.Session.GetString("otp");

        if (storedOtp == otp)
        {
            return Ok("OTP verified successfully");
        }
        else
        {
            return BadRequest("Invalid OTP");
        }
    }
    private string GenerateRandomOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private void SendOtpViaSms(string phoneNumber, string otp)
    {
        var accountSid = _configuration["Twilio:AccountSid"];
        var authToken = _configuration["Twilio:AuthToken"];
        var fromNumber = _configuration["Twilio:FromNumber"];

        TwilioClient.Init(accountSid, authToken);

        var message = MessageResource.Create(
            body: $"Your OTP is {otp}",
            from: new PhoneNumber(fromNumber),
            to: new PhoneNumber(phoneNumber)
        );        
    }
}
