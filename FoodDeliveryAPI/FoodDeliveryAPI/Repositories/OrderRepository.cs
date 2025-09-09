using Dapper;
using FoodDeliveryAPI.DTOs.Orders;
using FoodDeliveryAPI.Interfaces.Orders;
using FoodDeliveryAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;

namespace FoodDeliveryAPI.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IDbConnection _db;
        public OrderRepository(IDbConnection db) => _db = db;

        public async Task<int> AddOrderAsync(Order order)
        {
            var sql = @"
            INSERT INTO Orders (UserID, RestaurantID, TotalAmount)
            VALUES (@UserID, @RestaurantID, @TotalAmount);
            SELECT CAST(SCOPE_IDENTITY() as int);"
            ;

            var orderId = await _db.ExecuteScalarAsync<int>(sql, order);
            return orderId;
        }

        public async Task AddOrderItemsAsync(List<OrderItem> orderItems)
        {
            var sql = @"
            INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
            VALUES (@OrderID, @ItemID, @Quantity, @Price);"
            ;

            await _db.ExecuteAsync(sql, orderItems);
        }

        public async Task<IEnumerable<RestaurantsOrderDTO>> GetAllOrders()
        {
            string sql = "SELECT * FROM vw_RestaurantOrders";
            var orders = await _db.QueryAsync<RestaurantsOrderDTO>(sql);
            return orders;
        }
        public async Task<bool> UpdateOrderStatus(int orderID, string status)
        {
            var sql = @"UPDATE Orders 
                SET Status = @Status 
                WHERE OrderID = @OrderID";
            var rows = await _db.ExecuteAsync(sql, new { OrderID = orderID, Status = status });
            return rows > 0;


        }
    }
}
