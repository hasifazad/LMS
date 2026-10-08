import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Trainer {
    _id: string;
    name: string;
    email: string;
}

interface TrainerAuthState {
    trainer: Trainer | null;
    token: string | null;

    setAuth: (trainer: Trainer, token: string) => void;
    logout: () => void;
}

export const useTrainerAuthStore = create<TrainerAuthState>()(
    persist(
        (set) => ({
            trainer: null,
            token: null,

            setAuth: (trainer, token) => {
                set({
                    trainer,
                    token,
                });
            },

            logout: () => {
                set({
                    trainer: null,
                    token: null,
                });
            },
        }),
        {
            name: "trainer-auth",
        }
    )
);