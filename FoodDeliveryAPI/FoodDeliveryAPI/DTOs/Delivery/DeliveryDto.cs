namespace FoodDeliveryAPI.DTOs.Delivery
{
    public class DeliveryDto
    {
        public int DeliveryID { get; set; }
        public int OrderID { get; set; }
        public int DeliveryUserID { get; set; }
        public string Status { get; set; } = "Assigned";
        public DateTime? EstimatedTime { get; set; }
        public DateTime? DeliveredAt { get; set; }
    }
}
