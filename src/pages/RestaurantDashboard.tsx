// ...imports et useState initiaux
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

export default function RestaurantDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'burgers'
  });

  const fakeOrders = [
    { id: '1', item: 'Burger Classic', client: 'Jean Dupont', status: 'En cours' },
    { id: '2', item: 'Pizza Reine', client: 'Claire Martin', status: 'En préparation' }
  ];

  const orderHistory = [
    { id: '3', item: 'Sushi Saumon', client: 'Alexandre Dubois', date: '2025-04-29', price: 18.5 },
    { id: '4', item: 'Dessert Chocolat', client: 'Sophie Leroy', date: '2025-04-28', price: 6.0 }
  ];

  const totalRevenue = orderHistory.reduce((sum, order) => sum + order.price, 0);

  useEffect(() => {
    fetchMenuItems();
  }, [user]);

  async function fetchMenuItems() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', user.id);

      if (error) {
        console.error('Error fetching menu items:', error);
        return;
      }
      setItems(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  // ...handleSubmit, handleEdit, handleDelete identiques

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des plats</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center">
          <Plus className="h-5 w-5 mr-2" /> Ajouter un plat
        </button>
      </div>

      {/* Commandes en cours */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Commandes en cours</h2>
        <div className="space-y-2">
          {fakeOrders.map(order => (
            <div key={order.id} className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <div><strong>{order.item}</strong> - {order.client}</div>
                <div className="text-sm text-yellow-700 font-medium">{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gains totaux */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-300 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gains totaux</h2>
          <p className="text-2xl font-bold text-green-700">{totalRevenue.toFixed(2)} €</p>
        </div>
        <a
          href="https://www.paypal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
        >
          Retirer via PayPal
        </a>
      </div>

      {/* Historique des commandes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Historique des commandes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md">
            <thead>
              <tr>
                <th className="border px-4 py-2">Produit</th>
                <th className="border px-4 py-2">Client</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Montant (€)</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} className="text-center">
                  <td className="border px-4 py-2">{order.item}</td>
                  <td className="border px-4 py-2">{order.client}</td>
                  <td className="border px-4 py-2">{order.date}</td>
                  <td className="border px-4 py-2">{order.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carte des plats (inchangée) */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Carte des plats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-red-600 font-bold">{Number(item.price).toFixed(2)} €</span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal (inchangé) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
            {/* Formulaire (identique) */}
            {/* ... */}
          </div>
        </div>
      )}
    </div>
  );
}
