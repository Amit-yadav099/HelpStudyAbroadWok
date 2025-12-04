import { create } from 'zustand';
import { User, UsersResponse } from '@/src/types/user';
import { usersAPI } from '@/src/lib/api';

interface UserState {
  users: User[];
  selectedUser: User | null;
  total: number;
  skip: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (limit?: number, skip?: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,
  total: 0,
  skip: 0,
  limit: 10,
  isLoading: false,
  error: null,
  
  fetchUsers: async (limit = 10, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.getUsers(limit, skip);
      const data: UsersResponse = response.data;
      
      set({ 
        users: data.users, 
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch users', 
        isLoading: false 
      });
    }
  },
  
  searchUsers: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.searchUsers(query);
      const data: UsersResponse = response.data;
      
      set({ 
        users: data.users, 
        total: data.total,
        skip: 0,
        limit: data.limit,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to search users', 
        isLoading: false 
      });
    }
  },
  
  fetchUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersAPI.getUser(id);
      set({ 
        selectedUser: response.data, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch user', 
        isLoading: false 
      });
    }
  },
  
  clearSelectedUser: () => set({ selectedUser: null }),
}));