import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      addProduct: (product) => 
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'product-storage',
    }
  )
);
