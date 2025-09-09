namespace FoodDeliveryAPI.DTOs.Users
{
    public class AddressDTO
    {
        public int AddressID { get; set; }

        public int UserID { get; set; }


        public string AddressLine1 { get; set; }


        public string AddressLine2 { get; set; }


        public string Landmark { get; set; }


        public string City { get; set; }


        public string Pincode { get; set; }


    }
}
