using System.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.Services;
using FoodDeliveryAPI.Interfaces.User;
using System.Text;
using FoodDeliveryAPI.Interfaces.MenuItems;
using FoodDeliveryAPI.Repositories;
using FoodDeliveryAPI.Interfaces.Restaurant;
using Microsoft.Extensions.FileProviders;
using FoodDeliveryAPI.Interfaces.Orders;

var builder = WebApplication.CreateBuilder(args);

// Dapper DB connection factory (scoped per request)
builder.Services.AddSingleton<DatabaseContext>();
builder.Services.AddScoped<IDbConnection>(sp => sp.GetRequiredService<DatabaseContext>().CreateConnection());

// Repositories
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IMenuItems, MenuItemRepository>();
builder.Services.AddScoped<IRestaurantRepository, RestaurantRepository>();
// Services
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddControllers();

// ✅ Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactAppAndNative", policy =>
         policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
     );
});
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(7205); // Listen on all network interfaces
});
// Swagger + JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FoodDeliveryAPI", Version = "v1" });
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// JWT Auth
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
    RequestPath = "/uploads"
});
//app.UseHttpsRedirection();

// ✅ Enable CORS before Authentication
app.UseCors("AllowReactAppAndNative");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
