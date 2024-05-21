import { create } from 'zustand';
import { IUser } from '../utils/interfaces';

interface AppState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;

  access_token: string | null;
  setAccessToken: (accessToken: string | null) => void;
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
}));

export default useAppStore;
