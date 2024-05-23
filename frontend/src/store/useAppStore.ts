import { create } from 'zustand';
import { IUser } from '../utils/interfaces';

interface AppState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;

  access_token: string | null;
  setAccessToken: (accessToken: string | null) => void;

  error: string | null;
  setError: (error: string | null) => void;

  successMessage: string | null,
  setSuccessMessage: (successMessage: string | null) => void
}

const useAppStore = create<AppState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),

  access_token: null,
  setAccessToken: (access_token) =>
    set(() => {
      if (access_token) {
        sessionStorage.setItem('access_token', access_token);
      }

      return { access_token };
    }),
    error: null,
    setError: (error) => set(() => ({ error })),
    successMessage: null,
    setSuccessMessage: (successMessage) => set(() => ({ successMessage }))
}));

export default useAppStore;
