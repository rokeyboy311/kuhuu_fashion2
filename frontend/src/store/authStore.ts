import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { user, tokens } = data.data;
          localStorage.setItem('kf_access_token', tokens.accessToken);
          localStorage.setItem('kf_refresh_token', tokens.refreshToken);
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
          });
          toast.success(`Welcome back, ${user.firstName}!`);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { data: res } = await api.post('/auth/register', data);
          const { user, tokens } = res.data;
          localStorage.setItem('kf_access_token', tokens.accessToken);
          localStorage.setItem('kf_refresh_token', tokens.refreshToken);
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
          });
          toast.success('Account created successfully!');
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (refreshToken) await api.post('/auth/logout', { refreshToken });
        } catch {}
        localStorage.removeItem('kf_access_token');
        localStorage.removeItem('kf_refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        toast.success('Logged out');
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'kuhuu-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
