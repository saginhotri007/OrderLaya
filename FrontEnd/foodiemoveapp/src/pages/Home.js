import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Paper,
} from "@mui/material";

import {
  Home as HomeIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

export default function FoodDeliveryApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [value, setValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const categories = [
    { id: "", name: "All", icon: "🍽️" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "burger", name: "Burgers", icon: "🍔" },
    { id: "asian", name: "Asian", icon: "🍜" },
    { id: "healthy", name: "Healthy", icon: "🥗" },
    { id: "dessert", name: "Desserts", icon: "🍰" },
    { id: "coffee", name: "Coffee", icon: "☕" },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Mario's Italian Kitchen",
      category: "pizza",
      rating: 4.8,
      reviews: 120,
      deliveryTime: "25-35",
      deliveryFee: 2.99,
      image: "https://source.unsplash.com/200x150/?pizza",
      tags: ["Italian", "Pizza", "Pasta"],
      promoted: true,
    },
    {
      id: 2,
      name: "Burger Palace",
      category: "burger",
      rating: 4.6,
      reviews: 89,
      deliveryTime: "15-25",
      deliveryFee: 0,
      image: "https://source.unsplash.com/200x150/?burger",
      tags: ["American", "Burgers", "Fries"],
    },
    {
      id: 3,
      name: "Sushi Zen",
      category: "asian",
      rating: 4.9,
      reviews: 200,
      deliveryTime: "30-40",
      deliveryFee: 3.49,
      image: "https://source.unsplash.com/200x150/?sushi",
      tags: ["Japanese", "Sushi", "Fresh"],
    },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      !selectedCategory || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
    setFavorites(newFavorites);
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationIcon />
            <Box>
              <Typography variant="caption">Deliver to</Typography>
              <Typography variant="subtitle1">123 Main Street</Typography>
            </Box>
          </Box>
          <IconButton color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Greeting */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {getGreeting()}, Alex! 👋
        </Typography>
        <Typography color="text.secondary">What are you craving today?</Typography>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search restaurants or food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon color="action" />,
          }}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ display: "flex", overflowX: "auto", px: 2, py: 2, gap: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={`${cat.icon} ${cat.name}`}
            color={selectedCategory === cat.id ? "primary" : "default"}
            onClick={() => setSelectedCategory(cat.id)}
          />
        ))}
      </Box>

      {/* Restaurants */}
      <Grid container spacing={2} sx={{ px: 2 }}>
        {filteredRestaurants.map((restaurant) => (
          <Grid item xs={12} key={restaurant.id}>
            <Card sx={{ display: "flex", boxShadow: 3, borderRadius: 3 }}>
              <CardMedia
                component="img"
                sx={{ width: 120 }}
                image={restaurant.image}
                alt={restaurant.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">{restaurant.name}</Typography>
                  <IconButton onClick={() => toggleFavorite(restaurant.id)}>
                    {favorites.has(restaurant.id) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ⭐ {restaurant.rating} ({restaurant.reviews} reviews)
                </Typography>
                <Box mt={1}>
                  {restaurant.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    ⏱ {restaurant.deliveryTime} min | 🚚{" "}
                    {restaurant.deliveryFee === 0 ? "Free" : `$${restaurant.deliveryFee}`}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setCartCount((prev) => prev + 1)}
                  >
                    Order Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Search" icon={<SearchIcon />} />
          <BottomNavigationAction
            label="Cart"
            icon={
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            }
          />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
