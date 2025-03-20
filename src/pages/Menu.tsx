import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MenuItem } from '../types';
import { useStore } from '../store';
import { MENU_ITEMS } from '../data/menuItems';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');
  const addToCart = useStore(state => state.addToCart);

  const categories = ['all', 'burgers', 'pizza', 'sushi', 'desserts'];
  
  const filteredItems = MENU_ITEMS.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notre Menu</h1>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Link to={`/product/${item.id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/product/${item.id}`}>
                <h3 className="text-xl font-semibold hover:text-purple-600">
                  {item.name}
                </h3>
              </Link>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-purple-600 font-bold">
                  {item.price.toFixed(2)} €
                </span>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
                  onClick={() => addToCart({ ...item, quantity: 1 })}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}