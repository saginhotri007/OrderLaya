using System.Data;
using Microsoft.Data.SqlClient;


namespace FoodDeliveryAPI.Data
{
    public class DatabaseContext
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public DatabaseContext(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection")!;
        }
        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}