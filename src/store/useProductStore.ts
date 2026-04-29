import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // Base64 or URL
  timerEndsAt?: number | null; // Timestamp for countdown
  videoUrl?: string; // YouTube or other
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map snake_case from DB to camelCase in frontend
      const mappedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        timerEndsAt: item.timer_ends_at ? Number(item.timer_ends_at) : null,
        videoUrl: item.video_url
      }));

      set({ products: mappedProducts, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching products:', err);
      // Fallback or error handled gracefully
      set({ error: err.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      // Map camelCase to snake_case for DB
      const dbPayload = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        timer_ends_at: product.timerEndsAt,
        video_url: product.videoUrl
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      
      // Re-fetch or manually add to state
      await get().fetchProducts();
    } catch (err: any) {
      console.error('Error adding product:', err);
      alert('Failed to add product: ' + err.message);
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      const dbPayload: any = {};
      if (updatedProduct.name !== undefined) dbPayload.name = updatedProduct.name;
      if (updatedProduct.description !== undefined) dbPayload.description = updatedProduct.description;
      if (updatedProduct.price !== undefined) dbPayload.price = updatedProduct.price;
      if (updatedProduct.category !== undefined) dbPayload.category = updatedProduct.category;
      if (updatedProduct.image !== undefined) dbPayload.image = updatedProduct.image;
      if (updatedProduct.timerEndsAt !== undefined) dbPayload.timer_ends_at = updatedProduct.timerEndsAt;
      if (updatedProduct.videoUrl !== undefined) dbPayload.video_url = updatedProduct.videoUrl;

      const { error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', id);

      if (error) throw error;
      
      await get().fetchProducts();
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert('Failed to update product: ' + err.message);
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await get().fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product: ' + err.message);
    }
  }
}));
