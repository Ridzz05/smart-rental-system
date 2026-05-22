import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const CSRF = () =>
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const safeJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return null; }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = loading, null = guest
    const [authLoading, setAuthLoading] = useState(true);

    // Boot: check session
    useEffect(() => {
        fetch('/api/me', { credentials: 'same-origin' })
            .then(async r => (r.ok ? safeJson(r) : null))
            .then(data => { setUser(data); setAuthLoading(false); })
            .catch(() => { setUser(null); setAuthLoading(false); });
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF() },
            body: JSON.stringify({ email, password }),
        });
        const data = await safeJson(res);
        if (!res.ok) throw data ?? { message: 'Login gagal.' };
        setUser(data);
        return data;
    }, []);

    const register = useCallback(async (name, email, password, password_confirmation) => {
        const res = await fetch('/api/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF() },
            body: JSON.stringify({ name, email, password, password_confirmation }),
        });
        const data = await safeJson(res);
        if (!res.ok) throw data ?? { message: 'Registrasi gagal.' };
        setUser(data);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF() },
        });
        setUser(null);
    }, []);

    const updateUser = useCallback(async (payload) => {
        const res = await fetch('/api/me', {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF() },
            body: JSON.stringify(payload),
        });
        const data = await safeJson(res);
        if (!res.ok) throw data ?? { message: 'Gagal menyimpan.' };
        setUser(data);
        return data;
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
