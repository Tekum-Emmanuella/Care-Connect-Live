import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  nationalId: string;
  role: string;
  avatar?: string;
  bloodType?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
