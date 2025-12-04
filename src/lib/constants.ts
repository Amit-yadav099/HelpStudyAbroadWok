// App constants
export const APP_NAME = 'Help Study Abroad';
export const API_BASE_URL = 'https://dummyjson.com';

// Cache configuration
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const CACHE_KEYS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
} as const;

// Pagination constants
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [5, 10, 20, 50];

// Mock credentials for testing
export const TEST_CREDENTIALS = {
  username: 'kminchelle',
  password: '0lelplR',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USERS_CACHE: 'users_cache',
  PRODUCTS_CACHE: 'products_cache',
} as const;