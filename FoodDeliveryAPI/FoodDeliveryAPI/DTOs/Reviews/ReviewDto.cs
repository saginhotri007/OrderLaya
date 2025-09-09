namespace FoodDeliveryAPI.DTOs.Reviews
{
    public class ReviewDto
    {
        public int ReviewID { get; set; }
        public int UserID { get; set; }
        public int RestaurantID { get; set; }
        public int Rating { get; set; } // 1..5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateReviewRequest
    {
        public int RestaurantID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
