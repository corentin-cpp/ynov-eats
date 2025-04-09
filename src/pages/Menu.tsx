import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MenuItem } from '../types';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useStore(state => state.addToCart);

  const categories = ['all', 'burgers', 'pizza', 'sushi', 'desserts'];

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*');

        if (error) {
          console.error('Error fetching menu items:', error);
          return;
        }

        setMenuItems(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []);
  
  const filteredItems = menuItems.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
                src={item.image_url}
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
                  {Number(item.price).toFixed(2)} €
                </span>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
                  onClick={() => addToCart({ ...item, image: item.image_url, quantity: 1 })}
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