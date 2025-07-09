import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function fetchWithoutAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    };

    return fetch(`${BASE_API}${url}`, { ...options, headers });
}

export function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    return fetch(`${BASE_API}${url}`, { ...options, headers });
}

export function fetchWithFormData(url: string, formData: FormData): Promise<Response> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    return fetch(`${BASE_API}${url}`, {
        method: "POST",
        body: formData,
        headers,
    });
}
