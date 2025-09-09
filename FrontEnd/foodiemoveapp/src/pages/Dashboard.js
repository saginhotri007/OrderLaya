import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Dashboard = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f8fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Greeting Card */}
      <Box
  sx={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "0 0 20px 20px",
    p: 3,
    color: "white",
  }}
>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">Hello, Priya! 👋</Typography>
            <Typography variant="body2">Hyderabad, Telangana</Typography>
          </Box>
          <IconButton sx={{ color: "white" }}>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ p: 2, justifyContent: "center" }}>
  <Grid item>
    <Paper
      elevation={3}
      sx={{
        width: 150,         // ✅ Fixed width
        height: 100,        // ✅ Fixed height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        bgcolor: "white",
      }}
    >
      <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#667eea" }}>
        ₹2,450
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Due Amount
      </Typography>
    </Paper>
  </Grid>

  <Grid item>
    <Paper
      elevation={3}
      sx={{
        width: 150,         // ✅ Fixed width
        height: 100,        // ✅ Fixed height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        bgcolor: "white",
      }}
    >
      <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#667eea" }}>
        12
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Orders This Month
      </Typography>
    </Paper>
  </Grid>
</Grid>


      {/* Feature Grid */}
     <Grid container spacing={2} sx={{ p: 2, justifyContent: "center" }}>
  {[
    { title: "Find Shops", icon: "🛒" },
    { title: "My Orders", icon: "📦" },
    { title: "Payments", icon: "💳" },
    { title: "Reports", icon: "📊" },
  ].map((item, index) => (
    <Grid item xs={6} sm={3} key={index}>
      <Paper
        elevation={3}
        sx={{
          width: 140,         // ✅ Fixed width
          height: 140,        // ✅ Fixed height
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          bgcolor: "white",
          cursor: "pointer",
          margin: "auto",
        }}
      >
        <Typography sx={{ fontSize: "32px" }}>{item.icon}</Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
          {item.title}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>



      {/* Bottom Navigation */}
      <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", boxShadow: 3 }}>
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Search" icon={<SearchIcon />} />
          <BottomNavigationAction label="Orders" icon={<AssignmentIcon />} />
          <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Dashboard;
