"use client";

import { fetchWithoutAuth } from "@/lib/utils";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<{ message: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token in localStorage
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetchWithoutAuth(`/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const user: User = await response.json();

        setUser(user);
        setToken(user.token);
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const signup = async (name: string, email: string, password: string) => {
        const response = await fetchWithoutAuth(`/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        });
        let result: any = {};
        try {
            result = await response.json();
        } catch (e) {
            // If response is not JSON, fallback
        }
        if (!response.ok) {
            const error = result.error || response.statusText || "Signup failed";
            throw new Error(error);
        }
        return result;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
