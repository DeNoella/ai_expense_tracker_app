'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken, setUser, isAuthenticated } from '@/lib/auth';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import User from 'lucide-react/dist/esm/icons/user';
import BrandMark from '@/components/BrandMark';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
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
      console.log('📝 Attempting registration...', { 
        email, 
        hasPassword: !!password,
        hasName: !!fullName 
      });
      
      const response = await authAPI.register({ 
        full_name: fullName, 
        email, 
        password 
      });
      
      console.log('✅ Registration successful:', response.data);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Registration error details:', {
        error: err,
        message: err.message,
        response: err.response,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data
      });

      let errorMessage = 'Registration failed. Please try again.';
      
      // Network errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5000.';
      } 
      // Timeout errors
      else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      // HTTP errors with response
      else if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || `Server error: ${err.response.status}`;
      }
      // Other errors
      else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[rgba(14,165,233,0.25)] rounded-lg focus:ring-2 focus:ring-[rgba(14,165,233,0.5)] focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="De Noella"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-[rgba(14,165,233,0.25)] rounded-lg focus:ring-2 focus:ring-[rgba(14,165,233,0.5)] focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] via-[#0f9fbf] to-[#0f766e] text-white py-3 rounded-lg font-semibold hover:brightness-105 transition-all duration-200 shadow-lg shadow-[rgba(14,165,233,0.35)] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0ea5e9] hover:text-[#0f766e] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

