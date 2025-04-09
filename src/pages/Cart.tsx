import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, clearCart, user } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Simulate checkout process
    clearCart();
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-gray-600 mb-4">Ajoutez des articles à votre panier pour commander</p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
        >
          Voir le menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        Quantité: {item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span>{deliveryFee.toFixed(2)} €</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-red-600 text-white px-4 py-3 rounded-full hover:bg-red-700 transition"
          >
            {user ? 'Commander' : 'Se connecter pour commander'}
          </button>
        </div>
      </div>
    </div>
  );
}