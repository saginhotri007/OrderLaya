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
            using (var connection = _db) // Assuming _db is an IDbConnection
            {
                // ✅ Step 1: Create User first
                string userSql = @"
            INSERT INTO Users (Name,Email, PasswordHash, Role, Phone,ResPass)
            VALUES (@Name,@Email, @PasswordHash, @Role, @Phone,@ResPass);
            SELECT CAST(SCOPE_IDENTITY() as int);";

                // Generate random 6-digit password
                var random = new Random();
                string plainPassword = random.Next(100000, 999999).ToString();

                // Hash the password (important for security!)
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);

                var userParams = new
                {
                    Name = restaurant.Name,
                   Email= restaurant.Name+"@gmail.com",
                    PasswordHash = passwordHash,
                    Role = "Restaurant",
                    ResPass= plainPassword,
                    Phone = restaurant.Phone
                };

                int userId = await connection.ExecuteScalarAsync<int>(userSql, userParams);

                // ✅ Step 2: Create Restaurant linked to that UserID
                string restaurantSql = @"
            INSERT INTO Restaurants (UserID, Name, Description, Address, Phone, Status, ImageURL, Latitude, Longitude)
            VALUES (@UserID, @Name, @Description, @Address, @Phone, @Status, @ImageURL, @Latitude, @Longitude);
            SELECT CAST(SCOPE_IDENTITY() as int);";

                var restaurantParams = new
                {
                    UserID = userId,
                    restaurant.Name,
                    restaurant.Description,
                    restaurant.Address,
                    restaurant.Phone,
                    restaurant.Status,
                    restaurant.ImageUrl,
                    restaurant.Latitude,
                    restaurant.Longitude
                };

                int restaurantId = await connection.ExecuteScalarAsync<int>(restaurantSql, restaurantParams);

                // ✅ Return restaurant with new IDs
                restaurant.UserID = userId;
                restaurant.RestaurantId= restaurantId;

                // ⚠️ Optionally return the plain password so you can show or SMS it to the owner
                restaurant.GeneratedPassword = plainPassword;

                return restaurant;
            }
        }



        public async Task<IEnumerable<RestaurantDto>> GetAllRestaurant()
        {
            string sql = "SELECT * FROM Restaurants";
            var restaurants = await _db.QueryAsync<RestaurantDto>(sql);
            return restaurants;
        }

        public async Task<bool> DeleteRestaurant(int restaurantID)
        {
            string sql = "DELETE FROM Restaurants WHERE RestaurantID = @RestaurantID";
            int rowsAffected = await _db.ExecuteAsync(sql, new { RestaurantID = restaurantID });
            return rowsAffected > 0;
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
            ImageURL=@ImageURL,
           Latitude=@Latitude,
           Longitude=@Longitude
           WHERE RestaurantID = @RestaurantID
         ";

            var rowsAffected = await _db.ExecuteAsync(sql, restaurant);

            if (rowsAffected == 0)
                return null; // not found

            return restaurant;
        }

    
    }
}
