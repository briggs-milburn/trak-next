'use client';
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '../store/features/authSlice';

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Login failed');

      dispatch(setUser(json.user));
      router.push('/dashboard');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorLocal(e.message);
        dispatch(setError(e.message));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Sign In
        </h2>
        <AuthForm
          variant="login"
          loading={loading}
          onSubmit={handleLogin}
          error={error}
        />
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}
