// store/studentAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber?: string;
    enrollmentNumber?: string;
}

interface StudentAuthState {
    student: Student | null;
    token: string | null;

    setAuth: (student: Student, token: string) => void;
    logout: () => void;
}

export const useStudentAuthStore = create<StudentAuthState>()(
    persist(
        (set) => ({
            student: null,
            token: null,

            setAuth: (student, token) => {
                set({
                    student,
                    token,
                });
            },

            logout: () => {
                set({
                    student: null,
                    token: null,
                });
            },
        }),
        {
            name: "student-auth",
        }
    )
);