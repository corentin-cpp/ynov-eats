import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const signIn = useStore(state => state.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signIn(email, password, isRestaurant);
      navigate(isRestaurant ? '/restaurant/dashboard' : '/profile');
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRestaurant"
              checked={isRestaurant}
              onChange={(e) => setIsRestaurant(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isRestaurant" className="ml-2 block text-sm text-gray-700">
              Je suis un restaurateur
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-red-600 hover:text-red-700">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}