"use client";

import React, {

  createContext,

  useCallback,

  useContext,

  useEffect,

  useMemo,

  useState,

} from "react";

import { persistAuthToken, clearAuthToken, getStoredToken } from "@/lib/authToken";

import { apiFetch } from "@/lib/apiClient";

import { saveProfile, slugifyUsername } from "@/lib/profile";

/** @typedef {{ id: string, email?: string } | null} Me */

const AuthContext = createContext(null);

/** @param {unknown} srv */

export function persistServerProfileFields(srv) {

  if (!srv || typeof srv !== "object") return;

  /** @type {any} */

  const s = srv;

  saveProfile({

    displayName: s.name || "",

    username: slugifyUsername(s.username || ""),

    bio: s.bio || "",

    location: s.location || "",

    email: s.email || "",

    phone: s.phone || "",

    avatarUrl: s.avatarUrl || null,

    following:

      typeof s.following === "number" ? s.following : undefined,

    followers:

      typeof s.followers === "number" ? s.followers : undefined,

    likes:

      typeof s.likes === "number" ? s.likes : undefined,

    reliability:

      typeof s.reliability === "number"

        ? s.reliability

        : Number(s.reliabilityAvg ?? 8),

  });

}

export function AuthProvider({ children }) {

  const [me, setMe] = /** @type {any} */ (useState(null));

  const [loading, setLoading] = /** @type {any} */ (useState(true));

  const refreshMe = useCallback(async () => {

    if (!getStoredToken()) {

      setMe(null);

      return;

    }

    const res = await apiFetch("/api/auth/me");

    if (!res.ok) {

      clearAuthToken();

      setMe(null);

      return;

    }

    /** @type {any} */

    const payload = await res.json();

    setMe(payload);

    persistServerProfileFields(payload);

  }, []);

  useEffect(() => {

    let alive = true;

    (async () => {

      await refreshMe();

      if (alive)

        setLoading(false);

    })();

    return () => {

      alive = false;

    };

  }, [refreshMe]);

  /** @returns {Promise<{ ok:boolean, error?:string }>} */

  const signInWithPassword = async (email, password) => {

    const res = await apiFetch("/api/auth/login", {

      method: "POST",

      body: JSON.stringify({ email, password }),

    });

    /** @type {any} */

    const data = await res.json().catch(() => ({}));

    if (!res.ok)

      return {

        ok: false,

        error:

          typeof data?.error === "string"

            ? data.error

            : "Login failed",

      };

    persistAuthToken(data.token);

    setMe(null);

    await refreshMe();

    return { ok: true };

  };

  /** @returns {Promise<{ ok:boolean, error?:string }>} */

  const registerAccount = async (payload) => {

    const res = await apiFetch("/api/auth/register", {

      method: "POST",

      body: JSON.stringify(payload),

    });

    /** @type {any} */

    const data = await res.json().catch(() => ({}));

    if (!res.ok)

      return {

        ok: false,

        error:

          typeof data?.error === "string"

            ? data.error

            : "Registration failed",

      };

    persistAuthToken(data.token);

    setMe(null);

    await refreshMe();

    return { ok: true };

  };

  const signOutUser = () => {

    clearAuthToken();

    setMe(null);

  };

  const value = useMemo(

    () => ({

      me,

      loading,

      refreshMe,

      signInWithPassword,

      registerAccount,

      signOutUser,

    }),

    [

      loading,

      me,

      refreshMe,

      registerAccount,

      signInWithPassword,

    ],

  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx)

    throw new Error("useAuth must be used within AuthProvider");

  return ctx;

}

