import { create } from "zustand";
import { z } from "zod";

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
    setAccessToken: (access_token) => set(() => ({ access_token })),
}));

export default useAppStore;