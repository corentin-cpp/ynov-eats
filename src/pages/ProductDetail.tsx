import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuItems';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useStore(state => state.addToCart);

  const product = MENU_ITEMS.find(item => item.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p>Produit non trouvé</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full md:w-96 object-cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-purple-600">
                {product.price.toFixed(2)} €
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
            >
              Ajouter au panier - {(product.price * quantity).toFixed(2)} €
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}