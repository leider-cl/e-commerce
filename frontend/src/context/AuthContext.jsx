import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./auth-context";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function getInitialToken() {
  const params = new URLSearchParams(window.location.search);
  const tokenParam = params.get("token");

  if (tokenParam) {
    localStorage.setItem("token", tokenParam);
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
    return tokenParam;
  }

  return localStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!getInitialToken());

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    let cancelled = false;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        if (!cancelled) localStorage.removeItem("token");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw { message: data.error || "Error al iniciar sesión", needsVerification: data.needsVerification };
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al registrar");
    }

    return data;
  }, []);

  const resendVerification = useCallback(async (email) => {
    const res = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al reenviar verificación");
    }

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}
