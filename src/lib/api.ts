import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

// Users API
export const usersAPI = {
  getUsers: (limit: number = 10, skip: number = 0) =>
    api.get(`/users?limit=${limit}&skip=${skip}`),
  searchUsers: (query: string) =>
    api.get(`/users/search?q=${query}`),
  getUser: (id: number) =>
    api.get(`/users/${id}`),
};

// Products API
export const productsAPI = {
  getProducts: (limit: number = 10, skip: number = 0) =>
    api.get(`/products?limit=${limit}&skip=${skip}`),
  searchProducts: (query: string) =>
    api.get(`/products/search?q=${query}`),
  getProduct: (id: number) =>
    api.get(`/products/${id}`),
  getCategories: () =>
    api.get('/products/categories'),
  getProductsByCategory: (category: string, limit: number = 10, skip: number = 0) =>
    api.get(`/products/category/${category}?limit=${limit}&skip=${skip}`),
};