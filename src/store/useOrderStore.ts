import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string; // Typically UUID from DB
  customerEmail: string;
  productName: string;
  amount: number;
  reference: string;
  status: 'Pending' | 'Completed';
  date: string; // mapped from created_at
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  updateOrderStatus: (id: string, status: 'Pending' | 'Completed') => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedOrders: Order[] = (data || []).map(item => ({
        id: item.id,
        customerEmail: item.customer_email,
        productName: item.product_name,
        amount: item.amount,
        reference: item.reference,
        status: item.status as 'Pending' | 'Completed',
        date: item.created_at
      }));

      set({ orders: mappedOrders, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  addOrder: async (order) => {
    try {
      const dbPayload = {
        customer_email: order.customerEmail,
        product_name: order.productName,
        amount: order.amount,
        reference: order.reference,
        status: order.status
      };

      const { error } = await supabase
        .from('orders')
        .insert([dbPayload]);

      if (error) throw error;
      await get().fetchOrders();
    } catch (err: any) {
      console.error('Error adding order:', err);
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await get().fetchOrders();
    } catch (err: any) {
      console.error('Error updating order:', err);
    }
  },

  deleteOrder: async (id) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchOrders();
    } catch (err: any) {
      console.error('Error deleting order:', err);
    }
  }
}));
