namespace FoodDeliveryAPI.DTOs.Categories
{
    public class CategoryDto
    {
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
    }
}
