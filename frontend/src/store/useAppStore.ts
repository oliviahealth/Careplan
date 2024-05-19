import { create } from "zustand";
import { z } from "zod";
import { setCookie } from "../utils/cookie";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
});
export type User = z.infer<typeof UserSchema>;

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;

    access_token: string | null;
    setAccessToken: (accessToken: string | null) => void;
}

const useAppStore = create<AppState>()((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user })),

    access_token: null,
    setAccessToken: (access_token) => {
        if (access_token) {
            setCookie('access_token', access_token, 1);
        } else {
            document.cookie = 'access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
        }
        set(() => ({ access_token }));
    },
}));

export default useAppStore;