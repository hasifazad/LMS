import { create } from "zustand";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;

    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,

    login: (user, token) =>
        set({
            user,
            token,
        }),

    logout: () =>
        set({
            user: null,
            token: null,
        }),
}));