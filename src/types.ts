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
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}