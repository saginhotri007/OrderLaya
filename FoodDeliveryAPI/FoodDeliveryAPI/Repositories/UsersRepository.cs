using Dapper;
using System.Data;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.Interfaces.User;

public class UsersRepository : IUsersRepository
{
    private readonly IDbConnection _db;
    public UsersRepository(IDbConnection db) => _db = db;

    public async Task<int> CreateUser(User user)
    {
        string sql = "INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES (@Name, @Email, @PasswordHash, @Role); SELECT CAST(SCOPE_IDENTITY() as int);";
        return await _db.ExecuteScalarAsync<int>(sql, user);
    }

    public Task<int> CreateUserAsync(User user)
    {
        string sql = "INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES (@Name, @Email, @PasswordHash, @Role); SELECT CAST(SCOPE_IDENTITY() as int);";
        return  _db.ExecuteScalarAsync<int>(sql, user);
    }

    public Task<IEnumerable<User>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<User?> GetByEmailAsync(string email)
    {
        string sql = "SELECT * FROM Users WHERE Email = @Email";
        var user =  _db.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });

        if (user == null)
            throw new Exception("User not found");
        return user;

    }
    public async Task<IEnumerable<UserAddress>> GetAllUserAddressAsync(int UserId)
    {
        string sql = "SELECT * FROM UserAddresses WHERE UserId = @UserId";
        var user =await _db.QueryAsync<UserAddress>(sql, new { UserId = UserId });

        if (user == null)
            throw new Exception("User not found");
        return user;

    }

    public Task<User?> GetByIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public async Task<UserAddress?> AddOrUpdateUserAddress(UserAddress address)
    {
        var sql = @"
        IF EXISTS (SELECT 1 FROM UserAddresses WHERE UserID = @UserID)
        BEGIN
            UPDATE UserAddresses
            SET AddressLine1 = @AddressLine1,
                AddressLine2 = @AddressLine2,
                Landmark = @Landmark,
                City = @City,
                Pincode = @Pincode
            WHERE UserID = @UserID;

            SELECT AddressID FROM UserAddresses WHERE UserID = @UserID;
        END
        ELSE
        BEGIN
            INSERT INTO UserAddresses
            (UserID, AddressLine1, AddressLine2, Landmark, City, Pincode)
            VALUES (@UserID, @AddressLine1, @AddressLine2, @Landmark, @City, @Pincode);

            SELECT CAST(SCOPE_IDENTITY() as int);
        END
    ";

        // Execute query and get AddressID
        var addressID = await _db.QuerySingleAsync<int>(sql, address);
        address.AddressID = addressID;

        return address;
    }

}
