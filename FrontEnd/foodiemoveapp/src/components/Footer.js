import React from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, User } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-300">
      <div className="flex justify-around items-center py-3">
        
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium transition-all duration-200 ${
              isActive ? "text-red-500" : "text-gray-500 hover:text-red-400"
            }`
          }
        >
          <Home size={24} className="mb-1" />
          <span className="text-xs">Home</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium transition-all duration-200 ${
              isActive ? "text-red-500" : "text-gray-500 hover:text-red-400"
            }`
          }
        >
          <ShoppingCart size={24} className="mb-1" />
          <span className="text-xs">Cart</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium transition-all duration-200 ${
              isActive ? "text-red-500" : "text-gray-500 hover:text-red-400"
            }`
          }
        >
          <User size={24} className="mb-1" />
          <span className="text-xs">Profile</span>
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;
