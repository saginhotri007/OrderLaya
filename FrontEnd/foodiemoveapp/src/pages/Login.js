import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import api from "../api/apiClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const GradientButton = styled(Button)({
  background: "linear-gradient(90deg, #667eea, #764ba2)",
  color: "#fff",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: "12px",
  padding: "12px",
  fontSize: "16px",
  "&:hover": {
    background: "linear-gradient(90deg, #5a67d8, #6b46c1)",
  },
});

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        phone,
        password,
      });
      
    const { token, user, expiresAt } = response.data;
      // Save token & user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Call AuthContext login
      login(token, user, expiresAt);

      // Redirect
      navigate("/MenuItems");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#1a1a2e",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 350,
          borderRadius: 4,
          overflow: "hidden",
          textAlign: "center",
          p: 3,
          bgcolor: "#f9fafb",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            width: 70,
            height: 70,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Customer Login
        </Typography>
        <Box sx={{ height: "2px", bgcolor: "#667eea", mb: 3 }} />

        <TextField
          fullWidth
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            sx: { borderRadius: "10px" },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            sx: { borderRadius: "10px" },
          }}
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <GradientButton
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </GradientButton>

        <Typography
          variant="body2"
          sx={{ color: "#4a67ff", mt: 2, cursor: "pointer" }}
        >
          Forgot Password?
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
