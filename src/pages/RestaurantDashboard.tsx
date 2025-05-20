// ...imports et useState initiaux
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MenuItem, Order, OrderHistory } from '../types';
import { supabase } from '../lib/supabase';

export default function RestaurantDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [order, setOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'burgers'
  });

  const totalRevenue = orderHistory.reduce((sum, order) => sum + order.price, 0);

  useEffect(() => {
    fetchMenuItems();
    fetchOrderHistory();
    fetchOrders();
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

  async function fetchOrderHistory() {
    if (!user) return;
    try {
      const { data, error } = await supabase
      .from('order_history')
      .select(`
        id,
        item,
        price,
        date,
        users:users!order_history_client_fkey (
          name
        )
      `)
      .eq('restaurant_id', user.id);
      console.log(data);
    
      if (error) {
        console.error('Error fetching order history:', error);
        return;
      }
      setOrderHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function fetchOrders() {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('orders')
        .select('*')
        .eq('restaurant_id', user.id);
      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }
      setOrder(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const menuItem = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: formData.category,
      restaurant_id: user.id
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(menuItem)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([menuItem]);

        if (error) throw error;
      }

      await fetchMenuItems();
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'burgers'
      });
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image_url: item.image_url,
      category: item.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

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
          {order
            .filter(order => order.status !== 'Prête')
            .map(order => (
              <div key={order.id} className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div><strong>{order.item}</strong> - {order.users.name}</div>
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
                  <td className="border px-4 py-2">{order.users.name}</td>
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
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du plat
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="appetizers">Apéritifs</option>
                  <option value="breakfast">Petit-déjeuner</option>
                  <option value="brunch">Brunch</option>
                  <option value="burgers">Burgers</option>
                  <option value="cakes">Gâteaux</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Boissons</option>
                  <option value="fastfood">Fast Food</option>
                  <option value="grills">Grillades</option>
                  <option value="icecream">Glaces</option>
                  <option value="pastries">Pâtisseries</option>
                  <option value="pasta">Pâtes</option>
                  <option value="pizza">Pizzas</option>
                  <option value="salads">Salades</option>
                  <option value="sandwiches">Sandwichs</option>
                  <option value="seafood">Fruits de mer</option>
                  <option value="sides">Accompagnements</option>
                  <option value="snacks">Snacks</option>
                  <option value="soups">Soupes</option>
                  <option value="sushi">Sushi</option>
                  <option value="tacos">Tacos</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Végétarien</option>
                  <option value="wraps">Wraps</option>

                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                >
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
