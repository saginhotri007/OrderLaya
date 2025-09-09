using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryAPI.Models
{
    public class UserAddress
    {
       
        public int AddressID { get; set; }

        public int UserID { get; set; }

  
        public string AddressLine1 { get; set; }

   
        public string AddressLine2 { get; set; }

   
        public string Landmark { get; set; }

     
        public string City { get; set; }

 
        public string Pincode { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
