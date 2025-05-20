export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  points: number;
  orders: number;
  isRestaurant?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  restaurant_id?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  item: string;
  users: {
    name: string;
  };
  status: 'En cours' | 'En préparation' | 'Prête';
  created_at: string;
}

export interface OrderHistory {
  id: string;
  restaurant_id: string;
  item: string;
  users: {name:string;};
  price: number;
  date: string;
}
