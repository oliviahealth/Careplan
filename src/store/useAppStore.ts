import { create } from "zustand";
import { z } from "zod";

const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    username: z.string(),
});
type User = z.infer<typeof UserSchema>;

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
}

const useAppStore = create<AppState>()((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user })),
}));

export default useAppStore;