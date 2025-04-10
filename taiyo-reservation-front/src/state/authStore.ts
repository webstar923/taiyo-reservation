import { create } from 'zustand';
interface AuthState {
  isAuthenticated: boolean;
  setAuthenticatedUser: (authenticated: boolean) => void;

}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticatedUser: (authenticated) => set({ isAuthenticated: authenticated }),
}));