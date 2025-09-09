using FoodDeliveryAPI.DTOs.MenuItems;
using FoodDeliveryAPI.Interfaces.MenuItems;
using FoodDeliveryAPI.Interfaces.User;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly IMenuItems _menuItemRepo;
        private readonly IWebHostEnvironment _env;
        public MenuItemsController(IMenuItems menuItemRepo, IWebHostEnvironment env)
        {
            _menuItemRepo = menuItemRepo;
            _env = env;

        }


        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategory()
        {
            var categories = await _menuItemRepo.GetAllCategory();

            if (categories == null || !categories.Any())
                return NotFound("No categories found");

            return Ok(new
            {
                success = true,
                data = categories
            });
        }

        [HttpGet("menuitems")]
        public async Task<IActionResult> GetMenuItems([FromQuery] int restaurantId)
        {
            var items = await _menuItemRepo.GetMenuItemsByRestaurant(restaurantId);
            return Ok(new { success = true, data = items });
        }

        [HttpPost("menuitem")]
        public async Task<IActionResult> AddMenuItem([FromForm] CreateMenuItemRequest request, IFormFile? image)
        {
            if (request == null) return BadRequest("Invalid data");

            string? imagePath = null;
            if (request.ImageFile != null)
            {
                string folder = Path.Combine(_env.WebRootPath, "Uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = $"{Guid.NewGuid()}_{request.ImageFile.FileName}";
                string fullPath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.ImageFile.CopyToAsync(stream);
                }

                imagePath = $"/uploads/{fileName}";
            }

            var menuItem = new MenuItem
            {
                RestaurantID = request.RestaurantID,
                CategoryID = request.CategoryID,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                ImagePath = imagePath ?? request.ImagePath,
                Availability = request.Availability,
                Variant=request.Variant
            };

            await _menuItemRepo.AddMenuItem(menuItem);

            return Ok(new { success = true, message = "Menu item added successfully" });
        }

        // PUT: Update Menu Item
        [HttpPut("menuitem/{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromForm] CreateMenuItemRequest request, IFormFile? image)
        {
            var existing = await _menuItemRepo.GetMenuItemById(id);
            if (existing == null) return NotFound("Menu item not found");

            // Handle image upload
            if (image != null)
            {
                string folder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = $"{Guid.NewGuid()}_{image.FileName}";
                string fullPath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                existing.ImagePath = $"/uploads/{fileName}";
            }

            existing.RestaurantID = request.RestaurantID;
            existing.CategoryID = request.CategoryID;
            existing.Name = request.Name;
            existing.Description = request.Description;
            existing.Price = request.Price;
            existing.Availability = request.Availability;
            existing.Variant = request.Variant;
            await _menuItemRepo.UpdateMenuItem(existing);

            return Ok(new { success = true, message = "Menu item updated successfully" });
        }

    }
}
