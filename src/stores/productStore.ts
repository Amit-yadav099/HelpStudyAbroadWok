import { create } from 'zustand';
import { Product, ProductsResponse } from '@/src/types/product';
import { productsAPI } from '@/src/lib/api';

interface ProductState {
  products: Product[];
  categories: string[];
  selectedProduct: Product | null;
  total: number;
  skip: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  fetchProducts: (limit?: number, skip?: number) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (category: string, limit?: number, skip?: number) => Promise<void>;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  total: 0,
  skip: 0,
  limit: 10,
  isLoading: false,
  error: null,
  
  fetchProducts: async (limit = 10, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getProducts(limit, skip);
      const data: ProductsResponse = response.data;
      
      set({ 
        products: data.products, 
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },
  
  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.searchProducts(query);
      const data: ProductsResponse = response.data;
      
      set({ 
        products: data.products, 
        total: data.total,
        skip: 0,
        limit: data.limit,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to search products', 
        isLoading: false 
      });
    }
  },
  
  fetchProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getProduct(id);
      set({ 
        selectedProduct: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch product', 
        isLoading: false 
      });
    }
  },
  
  fetchCategories: async () => {
    try {
      const response = await productsAPI.getCategories();
      set({ categories: response.data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories' });
    }
  },
  
  fetchProductsByCategory: async (category: string, limit = 10, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsAPI.getProductsByCategory(category, limit, skip);
      const data: ProductsResponse = response.data;
      
      set({ 
        products: data.products, 
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch products by category', 
        isLoading: false 
      });
    }
  },
  
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));