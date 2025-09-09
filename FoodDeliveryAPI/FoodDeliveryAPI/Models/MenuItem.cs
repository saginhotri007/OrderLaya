namespace FoodDeliveryAPI.Models
{
    public class MenuItem
{
    public int ItemID { get; set; }
    public int RestaurantID { get; set; }
    public int? CategoryID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImagePath { get; set; }
    public bool Availability { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Variant { get; set; }
    }
}