namespace FoodDeliveryAPI.Interfaces.User
{
    using FoodDeliveryAPI.Models;
    public interface IUsersRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int userId);
        Task<int> CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllAsync();

        Task<UserAddress?> AddOrUpdateUserAddress(UserAddress address);
        Task<IEnumerable<UserAddress>> GetAllUserAddressAsync(int UserId);
    }
}
