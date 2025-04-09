import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Burgers
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Bœuf, cheddar, salade, tomate, oignon, sauce maison',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    category: 'burgers',
  },
  {
    id: '2',
    name: 'Burger Gourmet',
    description: 'Bœuf Angus, foie gras, roquette, oignon',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500',
    category: 'burgers',
  },
  // Pizzas
  {
    id: '3',
    name: 'Margherita',
    description: 'Sauce tomate, mozzarella, basilic frais',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    category: 'pizza',
  },
  {
    id: '4',
    name: 'Quattro Formaggi',
    description: 'Mozzarella, gorgonzola, parmesan, chèvre',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=500',
    category: 'pizza',
  },
  // Sushi
  {
    id: '5',
    name: 'California Roll',
    description: 'Crabe, avocat, concombre, tobiko',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
    category: 'sushi',
  },
  {
    id: '6',
    name: 'Sashimi Mix',
    description: 'Assortiment de saumon, thon et dorade',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500',
    category: 'sushi',
  },
  // Desserts
  {
    id: '7',
    name: 'Tiramisu',
    description: 'Mascarpone, café, cacao, biscuits',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
    category: 'desserts',
  },
  {
    id: '8',
    name: 'Crème Brûlée',
    description: 'Vanille de Madagascar, caramel',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500',
    category: 'desserts',
  },
];
