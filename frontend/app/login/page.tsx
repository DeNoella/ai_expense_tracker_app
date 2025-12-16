'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken, setUser, isAuthenticated } from '@/lib/auth';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import BrandMark from '@/components/BrandMark';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      setAuthToken(response.data.token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-[var(--card)] text-[var(--foreground)] rounded-2xl shadow-2xl shadow-[rgba(14,165,233,0.18)] p-8 border border-[rgba(14,165,233,0.12)]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandMark />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aicash</h1>
            <p className="text-gray-600">Welcome back! Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[rgba(14,165,233,0.25)] rounded-lg focus:ring-2 focus:ring-[rgba(14,165,233,0.5)] focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="noella@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[rgba(14,165,233,0.25)] rounded-lg focus:ring-2 focus:ring-[rgba(14,165,233,0.5)] focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] via-[#0f9fbf] to-[#0f766e] text-white py-3 rounded-lg font-semibold hover:brightness-105 transition-all duration-200 shadow-lg shadow-[rgba(14,165,233,0.35)] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#0ea5e9] hover:text-[#0f766e] font-semibold">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

