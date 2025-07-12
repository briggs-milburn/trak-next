"use client";
import React from "react";
import AuthForm from "../components/AuthForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../store/features/authSlice";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setErrorLocal] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  async function handleLogin(data: { email: string; password: string }) {
    setLoading(true);
    setErrorLocal(null);
    dispatch(setError(null));

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // include cookies, though for same-site it often works by default
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Login failed");

      dispatch(setUser(json.user));
      router.push("/dashboard");
    } catch (e: any) {
      setErrorLocal(e.message);
      dispatch(setError(e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthForm
        variant="login"
        loading={loading}
        onSubmit={handleLogin}
        error={error}
      />
    </div>
  );
}
