import { apiFetch } from "@/lib/api";

export type User = {
    id: string;
    full_name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "INSTITUTION";
    institution_name?: string | null;
};

export type LoginResponse = {
    access_token: string;
    token_type: string;
    user: User;
};

export async function login(email: string, password: string) {
    const result = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("trustlens_token", result.access_token);
    localStorage.setItem("trustlens_user", JSON.stringify(result.user));

    return result;
}

export function logout() {
    localStorage.removeItem("trustlens_token");
    localStorage.removeItem("trustlens_user");
    window.location.href = "/login";
}

export function getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem("trustlens_user");
    if (!raw) return null;

    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("trustlens_token");
}