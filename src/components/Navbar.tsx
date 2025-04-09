import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, UtensilsCrossed } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const { user, cart } = useStore();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="h-8 w-8 text-red-600" />
            <img
              src="https://i.ibb.co/zhRtb3gP/logo-Version-finale.png"
              alt="YnovEat Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un plat..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user?.isRestaurant && (
              <Link
                to="/restaurant/dashboard"
                className="text-gray-700 hover:text-red-600"
              >
                Dashboard
              </Link>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-700" />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}