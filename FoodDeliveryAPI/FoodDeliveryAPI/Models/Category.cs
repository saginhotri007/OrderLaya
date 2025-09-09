﻿namespace FoodDeliveryAPI.Models
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Variants { get; set; }
    }
}