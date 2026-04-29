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

const defaultProducts: Product[] = [
  {
    id: '1',
    name: '24k Pure Gold',
    description: 'Experience luxury in every scent with this premium fragrance.',
    price: 35000,
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1594035910387-fea477242680?auto=format&fit=crop&q=80&w=800',
    timerEndsAt: Date.now() + 30 * 60 * 1000, // 30 mins
  },
  {
    id: '2',
    name: 'Smart Collection',
    description: 'A smart choice for smart individuals. Long lasting and elegant.',
    price: 15000,
    category: 'Smart',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    name: 'Cool Breeze',
    description: 'Fresh, aquatic, and invigorating. Perfect for everyday wear.',
    price: 22000,
    category: 'Fresh',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703c5eb876?auto=format&fit=crop&q=80&w=800',
    timerEndsAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  },
  {
    id: '4',
    name: 'Mousouf',
    description: 'The viral sensation. Rich, deep, and incredibly long lasting.',
    price: 30000,
    category: 'Arabian',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bac08f977?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '5',
    name: 'Explore',
    description: 'For the adventurous spirit. A bold and captivating scent.',
    price: 18500,
    category: 'Bold',
    image: 'https://images.unsplash.com/photo-1523293115678-efa8fcf3deec?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '6',
    name: 'Pure Love',
    description: 'A romantic floral blend that captures the essence of love.',
    price: 26000,
    category: 'Floral',
    image: 'https://images.unsplash.com/photo-1588691517596-fdd284b3e8fb?auto=format&fit=crop&q=80&w=800',
    timerEndsAt: Date.now() + 45 * 60 * 1000, // 45 mins
  }
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: defaultProducts,
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

      // If empty, fallback to default products
      if (mappedProducts.length === 0) {
        set({ products: defaultProducts, isLoading: false });
      } else {
        set({ products: mappedProducts, isLoading: false });
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      // Fallback to default products on error
      set({ error: err.message, products: defaultProducts, isLoading: false });
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
      console.error('Error adding product to DB, falling back to local state:', err);
      const newProduct: Product = {
        id: Math.random().toString(),
        ...product
      };
      set(state => ({ products: [...state.products, newProduct] }));
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
      console.error('Error updating product in DB, falling back to local state:', err);
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
      }));
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
      console.error('Error deleting product in DB, falling back to local state:', err);
      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }));
    }
  }
}));
