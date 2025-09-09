using Dapper;
using FoodDeliveryAPI.DTOs.Restaurants;
using FoodDeliveryAPI.Interfaces.MenuItems;
using FoodDeliveryAPI.Interfaces.Restaurant;
using FoodDeliveryAPI.Models;
using System.Data;

namespace FoodDeliveryAPI.Repositories
{
    public class RestaurantRepository:IRestaurantRepository
    {
        private readonly IDbConnection _db;
        public RestaurantRepository(IDbConnection db) => _db = db;

        public async Task<CreateRestaurantRequest> AddRestaurant(CreateRestaurantRequest restaurant)
        {
            string sql = @"
            INSERT INTO Restaurants (UserID, Name, Description, Address, Phone, Status,ImageURL)
            VALUES (@UserID, @Name, @Description, @Address, @Phone, @Status,@ImageURL);
            SELECT CAST(SCOPE_IDENTITY() as int);
        ";

            // Insert and get new RestaurantID
            var newId = await _db.ExecuteScalarAsync<int>(sql, restaurant);

            // Return the created restaurant with new ID
            restaurant.UserID = restaurant.UserID; // already exists
            return restaurant;
        }


        public async Task<IEnumerable<RestaurantDto>> GetAllRestaurant()
        {
            string sql = "SELECT * FROM Restaurants";
            var restaurants = await _db.QueryAsync<RestaurantDto>(sql);
            return restaurants;
        }

        public async Task<RestaurantDto> UpdateRestaurant(RestaurantDto restaurant)
        {
            string sql = @"
        UPDATE Restaurants SET 
            UserID = @UserID,
            Name = @Name,
            Description = @Description,
            Address = @Address,
            Phone = @Phone,
            Rating = @Rating,
            Status = @Status,
            ImageURL=@ImageURL
           WHERE RestaurantID = @RestaurantID
         ";

            var rowsAffected = await _db.ExecuteAsync(sql, restaurant);

            if (rowsAffected == 0)
                return null; // not found

            return restaurant;
        }

    }
}
