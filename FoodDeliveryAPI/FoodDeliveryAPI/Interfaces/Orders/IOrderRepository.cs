using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Models;


namespace FoodDeliveryAPI.Interfaces.Orders
{
    public interface IOrderRepository
    {
        Task<int> AddOrderAsync(Order order);
        Task AddOrderItemsAsync(List<OrderItem> orderItems);
        Task<IEnumerable<RestaurantsOrderDTO>> GetAllOrders();
        Task<bool> UpdateOrderStatus(int orderId, string status);
        


    }
}
