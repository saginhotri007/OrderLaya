namespace FoodDeliveryAPI.Models
{
    public class Restaurant
    {
        public int RestaurantID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public decimal Rating { get; set; }
        public string Status { get; set; } = "Open";
        public DateTime CreatedAt { get; set; }
    }
}