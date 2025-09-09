using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Models;

namespace FoodDeliveryAPI.Interfaces.Restaurant
{
    public interface IRestaurantRepository
    {
        Task<IEnumerable<RestaurantDto>> GetAllRestaurant();
        Task<CreateRestaurantRequest> AddRestaurant(CreateRestaurantRequest restaurant);
        Task<RestaurantDto> UpdateRestaurant(RestaurantDto restaurant);
    }
}
