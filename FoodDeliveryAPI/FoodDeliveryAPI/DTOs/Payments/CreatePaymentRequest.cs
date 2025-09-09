namespace FoodDeliveryAPI.DTOs.Payments
{
    public class CreatePaymentRequest
    {
        public int OrderID { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "COD"; // COD, CreditCard, DebitCard, UPI, Wallet
        public string? TransactionID { get; set; }
    }
}
