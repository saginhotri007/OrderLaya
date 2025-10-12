namespace FoodDeliveryAPI.DTOs.Restaurants
{
    public class RestaurantDto
    {
        public int RestaurantID { get; set; }
        public int UserID { get; set; } // owner
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Phone { get; set; }

        public string? ImageURL { get; set; }
        public decimal Rating { get; set; }
        public string Status { get; set; } = "Open";
        public DateTime CreatedAt { get; set; }
        public string? Latitude { get; set; }
        public string Longitude { get; set; } = string.Empty;
    }

    public class CreateRestaurantRequest
    {
        public int UserID { get; set; } // owner id

        public int RestaurantId { get; set; } = 0;
        public string GeneratedPassword { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Status { get; set; } = "Open";
        public string? ImageUrl { get; set; }=string.Empty;

        public string? Latitude { get; set; }
        public string Longitude { get; set; } = string.Empty;
    }
}
