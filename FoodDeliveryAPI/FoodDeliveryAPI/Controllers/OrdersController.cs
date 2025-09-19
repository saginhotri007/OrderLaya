using Azure.Core;
using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.DTOs.Users;
using FoodDeliveryAPI.Interfaces.Orders;
using FoodDeliveryAPI.Interfaces.User;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.Repositories;
using FoodDeliveryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IUsersRepository _usersRepo;
        private readonly IOrderRepository _ordersRepo;
        private readonly PasswordHasher _hasher;
        private readonly IJwtTokenService _jwt;
        public OrdersController(IUsersRepository usersRepo, IOrderRepository orderRepo)
        {
            _usersRepo = usersRepo;
            _ordersRepo = orderRepo;


        }
        [HttpPost("Address")]
        public async Task<IActionResult> Address([FromBody] AddressDTO useraddress)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("All required fields must be filled");
            }

            var address = new UserAddress
            {
                UserID = useraddress.UserID,
                AddressLine1 = useraddress.AddressLine1,
                AddressLine2 = useraddress.AddressLine2,
                Landmark = useraddress.Landmark,
                City = useraddress.City,
                Pincode = useraddress.Pincode,
               
            };
            await _usersRepo.AddOrUpdateUserAddress(address);

            return Ok(new { success = true, message = "Address added successfully" });
      
        }

        [HttpGet("Address")]
        public async Task<IActionResult> GetAllUserAddressAsync([FromQuery] int userId)
        {
            var items = await _usersRepo.GetAllUserAddressAsync(userId);
            return Ok(new { success = true, data = items });
        }

        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (!ModelState.IsValid || request.Items == null || !request.Items.Any())
            {
                return BadRequest("Invalid order data.");
            }

            var order = new Order
            {
                UserID = request.UserID, // Replace with your actual logic to get logged-in user ID
                RestaurantID = request.RestaurantID,
                TotalAmount = request.Items.Sum(i => i.Quantity * i.Price),
                Status = "Pending", // or any default
                PaymentStatus = "Unpaid", // default
                CreatedAt = DateTime.UtcNow,
            };

            // Save Order first to get OrderID
           var orderId= await _ordersRepo.AddOrderAsync(order);

            // Now create OrderItems
            var orderItems = request.Items.Select(item => new OrderItem
            {
                OrderID = orderId, // FK after order is saved
                ItemID = item.ItemID,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList();

            await _ordersRepo.AddOrderItemsAsync(orderItems);

            return Ok(new { success = true, message = "Order placed successfully", orderId = order.OrderID });
        }

        //[HttpGet("Restaurantsorder")]
        //public async Task<IActionResult> GetAllOrders()
        //{
        //    var order = await _ordersRepo.GetAllOrders();

        //    if (order == null || !order.Any())
        //        return NotFound("No order found");

        //    return Ok(new
        //    {
        //        success = true,
        //        data = order
        //    });
        //}
        [HttpGet("Restaurantsorder")]
        public async Task<IActionResult> GetRestaurantOrders([FromQuery] int RestaurantID)
        {
            var orders = await _ordersRepo.GetAllOrders();

            // Filter by UserID
            var filtered = orders.Where(o => o.RestaurantID == RestaurantID)
                       .Select(o => new {
                           o.OrderID,
                           o.UserID,
                           o.RestaurantID,
                           o.TotalAmount,
                           o.Status,
                           o.PaymentStatus,
                           o.CreatedAt,
                           o.CustomerName,
                           o.CustomerPhone,
                           o.Address,
                           Items = o.ItemList   // ✅ Proper list
                       });

            return Ok(new { success = true, data = filtered });

        }
        [HttpPost("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateOrderStatusDTO dto)
        {
            if (dto == null || dto.OrderID <= 0 || string.IsNullOrEmpty(dto.Status))
                return BadRequest(new { success = false, message = "Invalid request" });

            var updated = await _ordersRepo.UpdateOrderStatus(dto.OrderID, dto.Status);

            if (!updated)
                return NotFound(new { success = false, message = "Order not found" });

            return Ok(new { success = true, message = "Order status updated successfully" });
        }

        [HttpGet("Orders")]
        public async Task<IActionResult> GetOrdersByUser([FromQuery] int userID)
        {
            var Orders = await _ordersRepo.GetAllOrders();

            // Filter by UserID
            var userOrders = Orders.Where(r => r.UserID == userID).ToList();

            if (!userOrders.Any())
                return NotFound("No Orders found for this user");

            return Ok(new { success = true, data = userOrders });
        }
    }
}
