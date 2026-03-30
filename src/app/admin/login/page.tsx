'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiUrl } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Login successful!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
            GHL
          </div>
          <h1 className="text-2xl font-bold text-white">Blog Admin</h1>
          <p className="text-brand-grey-400 mt-1">Sign in to manage your blog</p>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-darkgrey rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-grey-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red outline-none"
              placeholder="admin@ghlindiaventures.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-grey-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
