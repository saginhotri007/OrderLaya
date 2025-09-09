using System.Collections.Generic;

namespace FoodDeliveryAPI.DTOs.Orders
{
    public class CreateOrderRequest
    {
        public int RestaurantID { get; set; }
        public int UserID { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        // optional delivery address override
        public string? DeliveryAddress { get; set; }
    }

    public class OrderItemDto
    {
        public int ItemID { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal Price { get; set; }
    }
    public class UpdateOrderStatusDTO
    {
        public int OrderID { get; set; }
        public string Status { get; set; }  // "Pending" | "Accepted" | "Rejected" | "Preparing" | "Completed"
    }
}
