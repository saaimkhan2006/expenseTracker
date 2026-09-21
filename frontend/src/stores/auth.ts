import { create } from 'zustand';
import { api } from '../services/api';

type User = { id: string; name: string; email: string } | null;

export const useAuth = create<{
  user: User; token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void; hydrate: () => void;
}>((set) => ({
  user: null,
  token: localStorage.getItem('sb_token'),
  hydrate() {
    const token = localStorage.getItem('sb_token');
    const user = localStorage.getItem('sb_user');
    if (token && user) set({ token, user: JSON.parse(user) });
  },
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user', JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('sb_token', data.token);
    localStorage.setItem('sb_user', JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },
  logout() {
    localStorage.removeItem('sb_token'); localStorage.removeItem('sb_user');
    set({ user: null, token: null });
  },
}));
