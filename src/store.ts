import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem } from './types';
import { supabase } from './lib/supabase';

interface Store {
  user: User | null;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  signIn: (email: string, password: string, isRestaurant: boolean) => Promise<void>;
  signUp: (email: string, password: string, name: string, isRestaurant: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      setUser: (user) => set({ user }),
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),
      clearCart: () => set({ cart: [] }),
      signIn: async (email: string, password: string, isRestaurant: boolean) => {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            set({
              user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                createdAt: new Date(profile.created_at),
                points: profile.points,
                orders: profile.orders_count,
                isRestaurant: profile.is_restaurant
              }
            });
          }
        }
      },
      signUp: async (email: string, password: string, name: string, isRestaurant: boolean) => {
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email,
              name,
              is_restaurant: isRestaurant,
            });

          if (profileError) throw profileError;

          set({
            user: {
              id: user.id,
              email,
              name,
              createdAt: new Date(),
              points: 0,
              orders: 0,
              isRestaurant
            }
          });
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      }
    }),
    {
      name: 'user-store', // Nom de la clé dans le localStorage
      partialize: (state) => ({ user: state.user }), // Persiste uniquement l'utilisateur
    }
  )
);