import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import MenuItems from "./pages/Admin/MenuItems";
import Restaurant from "./pages/Admin/Restaurant";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Top Navigation */}
          <Navbar />

          {/* Main Content */}
          <div className="pb-16"> {/* Padding bottom for footer space */}
            <Routes>
              <Route path="/" element={<Home />} />
                <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/MenuItems" element={<MenuItems />} />
              <Route path="/Restaurant" element={<Restaurant />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          {/* Footer always at the bottom */}
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
