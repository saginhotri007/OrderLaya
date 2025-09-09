namespace FoodDeliveryAPI.Models
{
    public class Payment
    {
        public int PaymentID { get; set; }
        public int OrderID { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string? TransactionID { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}