using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Interfaces.MenuItems;
using FoodDeliveryAPI.Interfaces.Restaurant;
using FoodDeliveryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Reflection;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly IRestaurantRepository _restaurantRepo;
        public RestaurantsController(IRestaurantRepository restaurantRepo)
        {
            _restaurantRepo = restaurantRepo;

        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> GetAllRestaurants()
        {
            var restaurants = await _restaurantRepo.GetAllRestaurant();

            if (restaurants == null || !restaurants.Any())
                return NotFound("No restaurants found");

            return Ok(new
            {
                success = true,
                data = restaurants
            });
        }
        [HttpGet("restaurant")]
        public async Task<IActionResult> GetRestaurantsByUser([FromQuery] int userID)
        {
            var restaurants = await _restaurantRepo.GetAllRestaurant();

            // Filter by UserID
            var userRestaurants = restaurants.Where(r => r.UserID == userID).ToList();

            if (!userRestaurants.Any())
                return NotFound("No restaurants found for this user");

            return Ok(new { success = true, data = userRestaurants });
        }

        [HttpPost("restaurant")]
        public async Task<IActionResult> AddRestaurant([FromForm] CreateRestaurantRequest restaurant, IFormFile Image)
        {
            if (restaurant == null)
                return BadRequest(new { success = false, message = "Invalid restaurant data" });

            try
            {
                if (Image != null)
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    var filePath = Path.Combine(uploadDir, Image.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await Image.CopyToAsync(stream);
                    }

                    restaurant.ImageUrl = "/images/" + Image.FileName; // store relative URL
                }

                var newRestaurant = await _restaurantRepo.AddRestaurant(restaurant);

                return Ok(new
                {
                    success = true,
                    data = newRestaurant,
                    message = "Restaurant added successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("restaurant/{id}")]
        public async Task<IActionResult> UpdateRestaurant(
                 int id,
                 [FromForm] RestaurantDto restaurant,
                 IFormFile? Image
             )
        {
            if (restaurant == null || id != restaurant.RestaurantID)
                return BadRequest(new { success = false, message = "Invalid restaurant data" });

            try
            {
                if (Image != null && Image.Length > 0)
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(uploadDir))
                        Directory.CreateDirectory(uploadDir);

                    var fileName = $"restaurant_{Guid.NewGuid()}{Path.GetExtension(Image.FileName)}";
                    var filePath = Path.Combine(uploadDir, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await Image.CopyToAsync(stream);
                    }

                    restaurant.ImageUrl = "/images/" + fileName;
                }

                var updatedRestaurant = await _restaurantRepo.UpdateRestaurant(restaurant);

                if (updatedRestaurant == null)
                    return NotFound(new { success = false, message = "Restaurant not found" });

                return Ok(new
                {
                    success = true,
                    data = updatedRestaurant,
                    message = "Restaurant updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


    }
}
