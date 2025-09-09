using Dapper;
using FoodDeliveryAPI.Interfaces.MenuItems;
using FoodDeliveryAPI.Models;
using System.Data;

namespace FoodDeliveryAPI.Repositories
{
    public class MenuItemRepository:IMenuItems
    {
        private readonly IDbConnection _db;
        public MenuItemRepository(IDbConnection db) => _db = db;

        public async Task AddMenuItem(MenuItem menuItem)
        {
            // Insert Menu Item and get the new ID
            string sqlMenuItem = @"
        INSERT INTO MenuItems (RestaurantID, CategoryID, Name, Description, Price, ImagePath, Availability)
        VALUES (@RestaurantID, @CategoryID, @Name, @Description, @Price, @ImagePath, @Availability);
        SELECT CAST(SCOPE_IDENTITY() as int);";

            var newItemId = await _db.ExecuteScalarAsync<int>(sqlMenuItem, menuItem);

            // Insert Variant if exists
            if (!string.IsNullOrEmpty(menuItem.Variant))
            {
                string sqlVariant = @"
            INSERT INTO ItemVariants (FoodItemID, VariantName,Price)
            VALUES (@FoodItemID, @VariantName,@Price);";

                await _db.ExecuteAsync(sqlVariant, new
                {
                    FoodItemID = newItemId,
                    VariantName = menuItem.Variant,
                    Price= menuItem.Price,
                });
            }
        }

        public async Task UpdateMenuItem(MenuItem menuItem)
        {
            // Update MenuItems table
            string sql = @"
        UPDATE MenuItems
        SET RestaurantID = @RestaurantID, 
            CategoryID = @CategoryID, 
            Name = @Name, 
            Description = @Description,
            Price = @Price, 
            ImagePath = @ImagePath, 
            Availability = @Availability
        WHERE ItemID = @ItemID";

            await _db.ExecuteAsync(sql, menuItem);

            // Check if Variant exists and update ItemVariants table
            if (!string.IsNullOrEmpty(menuItem.Variant))
            {
                // Check if variant already exists for this menu item
                string checkVariantSql = "SELECT COUNT(*) FROM ItemVariants WHERE FoodItemID = @FoodItemID";

                int count = await _db.ExecuteScalarAsync<int>(checkVariantSql, new { FoodItemID = menuItem.ItemID });

                if (count > 0)
                {
                    // Update existing variant
                    string updateVariantSql = @"
                UPDATE ItemVariants
                SET VariantName = @VariantName,
                    Price = @Price
                WHERE FoodItemID = @FoodItemID";

                    await _db.ExecuteAsync(updateVariantSql, new
                    {
                        FoodItemID = menuItem.ItemID,
                        VariantName = menuItem.Variant,
                        Price = menuItem.Price
                    });
                }
                else
                {
                    // Insert new variant if none exists
                    string insertVariantSql = @"
                INSERT INTO ItemVariants (FoodItemID, VariantName, Price)
                VALUES (@FoodItemID, @VariantName, @Price)";

                    await _db.ExecuteAsync(insertVariantSql, new
                    {
                        FoodItemID = menuItem.ItemID,
                        VariantName = menuItem.Variant,
                        Price = menuItem.Price
                    });
                }
            }
        }


        public async Task DeleteMenuItem(int id)
        {
            string sql = "DELETE FROM MenuItems WHERE ID = @ID";
            await _db.ExecuteAsync(sql, new { ID = id });
        }


        public async Task<IEnumerable<Category>> GetAllCategory()
        {
            string sql = "SELECT * FROM Categories";
            var categories = await _db.QueryAsync<Category>(sql);
            return categories;
        }

        public async Task<MenuItem?> GetMenuItemById(int id)
        {
            string sql = "SELECT * FROM MenuItems WHERE ItemId = @ID";
            var item = await _db.QueryFirstOrDefaultAsync<MenuItem>(sql, new { ID = id });
            return item;
        }

        public async Task<IEnumerable<MenuItem>> GetMenuItemsByRestaurant(int restaurantId)
        {
            string sql = @"SELECT ItemID,RestaurantID,CategoryID,Name,Description,m.Price,Availability,VariantName as Variant FROM MenuItems m left join ItemVariants I on m.ItemID=I.FoodItemID 
              WHERE RestaurantID = @RestaurantID ";
            var items = await _db.QueryAsync<MenuItem>(sql, new { RestaurantID = restaurantId });
            return items;
        }

    }
}
