import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    location?: string;
    interests?: string[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Methods
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Partial<User> & { password: string }) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    // This is a mock implementation - in a real app, you would call your API
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Check credentials (mock)
                    if (email === "demo@example.com" && password === "password") {
                        const user: User = {
                            id: "user-1",
                            name: "Demo User",
                            email: "demo@example.com",
                            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
                            location: "San Francisco, CA",
                            interests: ["Coffee", "Technology", "Food"],
                        };

                        const token = "mock-jwt-token";

                        set({ user, token, isAuthenticated: true, isLoading: false });
                    } else {
                        set({ error: "Invalid email or password", isLoading: false });
                    }
                } catch (error) {
                    set({ error: "Failed to log in. Please try again.", isLoading: false });
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });

                try {
                    // This is a mock implementation - in a real app, you would call your API
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Create user (mock)
                    const user: User = {
                        id: "user-" + Math.random().toString(36).substr(2, 9),
                        name: userData.name || "",
                        email: userData.email || "",
                        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
                        location: userData.location,
                        interests: userData.interests,
                    };

                    const token = "mock-jwt-token";

                    set({ user, token, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ error: "Failed to register. Please try again.", isLoading: false });
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: async (userData) => {
                set({ isLoading: true, error: null });

                try {
                    const currentUser = get().user;

                    if (!currentUser) {
                        throw new Error("Not authenticated");
                    }

                    // This is a mock implementation - in a real app, you would call your API
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const updatedUser: User = {
                        ...currentUser,
                        ...userData,
                    };

                    set({ user: updatedUser, isLoading: false });
                } catch (error) {
                    set({ error: "Failed to update profile. Please try again.", isLoading: false });
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });

                try {
                    const token = get().token;

                    if (!token) {
                        set({ isAuthenticated: false, isLoading: false });
                        return false;
                    }

                    // This is a mock implementation - in a real app, you would validate the token
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    // For demo, we'll assume the token is valid
                    set({ isAuthenticated: true, isLoading: false });
                    return true;
                } catch (error) {
                    set({ isAuthenticated: false, isLoading: false });
                    return false;
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);
