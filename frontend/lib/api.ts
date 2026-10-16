import { getSession, setAccessToken, clearSession } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    const session = getSession();
    if (!session) return null;

    try{
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        setAccessToken(data.accessToken);
        return data.accessToken as string;
    } catch {
        return null;
    }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response>{
    const session = getSession();

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
    })

    if (response.status !== 401){
        return response;
    }

    if (!refreshPromise){
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken){
        clearSession();
        window.location.replace("/login");
        return response;
    }

    return fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${newAccessToken}`,
        },
    });
}