import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const categories = [
    {
      id: 'burgers',
      name: 'Burgers',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    },
    {
      id: 'pizza',
      name: 'Pizzas',
      image:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    },
    {
      id: 'sushi',
      name: 'Sushi',
      image:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
    },
    {
      id: 'desserts',
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative h-[500px] -mt-8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              La livraison de vos plats préférés
            </h1>
            <p className="text-xl text-white">
              Découvrez les meilleurs restaurants près de chez vous
            </p>
            <Link
              to="/menu"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition"
            >
              Commander maintenant
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Catégories</h2>
          <Link
            to="/menu"
            className="text-purple-600 flex items-center hover:text-purple-700"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className="group relative h-48 rounded-lg overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
