import create from 'zustand';

type AuthState = {
  token: string | null;
  refresh: string | null;
  user: any | null;
  setAuth: (token: string, refresh: string, user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refresh: null,
  user: null,
  setAuth: (token, refresh, user) => set({ token, refresh, user }),
  logout: () => set({ token: null, refresh: null, user: null })
}));

export function useAuth() {
  return useAuthStore();
}
