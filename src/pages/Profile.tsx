import React from 'react';
import { useStore } from '../store';
import { User, ShoppingBag, Award } from 'lucide-react';

export default function Profile() {
  const { user } = useStore();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingBag className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Commandes</span>
            </div>
            <p className="text-2xl font-bold">{user.orders}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Points fidélité</span>
            </div>
            <p className="text-2xl font-bold">{user.points}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Membre depuis</span>
            </div>
            <p className="text-2xl font-bold">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Supprimer mon compte
          </button>
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            onClick={() => {
              useStore.getState().signOut();
            }}>
            Deconnexion
          </button>
        </div>
      </div>
    </div>
  );
}