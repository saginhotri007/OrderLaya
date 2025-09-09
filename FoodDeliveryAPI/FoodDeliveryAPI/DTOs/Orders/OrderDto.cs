using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryAPI.DTOs.Orders
{
    public class OrderDto
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public int RestaurantID { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public string PaymentStatus { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
    }
    public class RestaurantsOrderItems
    {
        public int OrderItemID { get; set; }
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public int Quantity { get; set; }
        public decimal ItemPrice { get; set; }
    }

    public class OrderItemDTO
    {
        public int ItemID { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class RestaurantsOrderDTO
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public int RestaurantID { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime CreatedAt { get; set; }

        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string Address { get; set; }

        // JSON string को पकड़ने के लिए helper
        public string Items { get; set; }

        // Deserialized list (not mapped in SQL directly)
        [NotMapped]
        public List<OrderItemDTO> ItemList
            => string.IsNullOrEmpty(Items) ? new List<OrderItemDTO>() :
               System.Text.Json.JsonSerializer.Deserialize<List<OrderItemDTO>>(Items);
    }

}
