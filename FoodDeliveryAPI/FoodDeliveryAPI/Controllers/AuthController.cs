using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.DTOs.Auth;
using FoodDeliveryAPI.Interfaces.User;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Data;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.TwiML.Voice;
using Twilio.Types;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsersRepository _usersRepo;
    private readonly PasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;
    private readonly IConfiguration _configuration;

    private readonly TwilioSettings _twilioSettings;

    public AuthController(IUsersRepository usersRepo, PasswordHasher hasher, IJwtTokenService jwt, IOptions<TwilioSettings> twilioSettings)
    {
        _usersRepo = usersRepo;
        _hasher = hasher;
        _jwt = jwt;
        _twilioSettings = twilioSettings.Value;
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
        
        var user = await _usersRepo.GetByPhoneAsync(req.Phone);
        if (user == null) return Unauthorized("Invalid credentials");
        if (!_hasher.Verify(req.Password, user.PasswordHash)) return Unauthorized("Invalid credentials");

        var token = _jwt.GenerateToken(user, out var expiresAt);

        return Ok(new
        {
            token,
            expiresAt,
            user = new { user.UserID, user.Name, user.Email, user.Role,user.Phone }
        });
    }

    [HttpPost("generate-otp")]
    public async Task<IActionResult> GenerateOtp(LoginRequest req)
    {
        var user = await _usersRepo.GetByPhoneAsync(req.Phone);
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
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var storedOtp = HttpContext.Session.GetString("otp");

        if (string.IsNullOrEmpty(storedOtp) || storedOtp != request.Otp)
        {
            return BadRequest("Invalid OTP");
        }

        var user = new FoodDeliveryAPI.Models.User
        {
            Name = "User",
            Email = "User@gmail.com",
            PasswordHash = "dsd", // TODO: Replace with proper password hashing
            Phone = request.Phone,
            Role = "Customer"
        };

        var newId = await _usersRepo.CreateUserAsync(user);
        user.UserID = newId;
        var userDetails =  await _usersRepo.GetByPhoneAsync(request.Phone);
        var token = _jwt.GenerateToken(user, out var expiresAt);

        return Ok(new
        {
            token,
            expiresAt,
            user = new
            {
               userDetails.UserID,
               userDetails.Name,
                userDetails.Email,
                 userDetails.Role
            }
        });
    }

    private string GenerateRandomOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private void SendOtpViaSms(string phoneNumber, string otp)
    {
        var accountSid = _twilioSettings.AccountSid; ;
        var authToken = _twilioSettings.AuthToken;
        var fromNumber = _twilioSettings.BussinessPhone;

        TwilioClient.Init(accountSid, authToken);

        var message = MessageResource.Create(
          from: new Twilio.Types.PhoneNumber("whatsapp:+14155238886"), // Twilio sandbox number
          to: new Twilio.Types.PhoneNumber("whatsapp:+917982493795"),   // Customer number
          body: "Hello! Your order has been confirmed from Order Laya ..Testing . 🎉"
      );

        Console.WriteLine(message.Sid);

        //var message = MessageResource.Create(
        //    body: $"Your OTP is {otp}",
        //    from: new PhoneNumber(fromNumber),
        //    to: new PhoneNumber(phoneNumber)
        //);        
    }
}
