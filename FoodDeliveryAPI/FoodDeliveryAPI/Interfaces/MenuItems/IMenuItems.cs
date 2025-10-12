using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Interfaces.MenuItems
{
    public interface IMenuItems
    {
        Task<IEnumerable<Category>> GetAllCategory();
        Task<IEnumerable<MenuItem>> GetMenuItemsByRestaurant(int restaurantId);
        Task<IEnumerable<MenuItem>> GetRestaurantByCategory(int CategoryId);

        Task<IEnumerable<MenuItem>> GetRecommendedItems();
        Task<MenuItem?> GetMenuItemById(int id);
        Task AddMenuItem(MenuItem menuItem);
        Task UpdateMenuItem(MenuItem menuItem);
        Task DeleteMenuItem(int id);
    }
}
