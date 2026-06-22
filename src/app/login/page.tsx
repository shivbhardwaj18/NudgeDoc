'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      // Redirect to dashboard
      router.push('/dashboard');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glowing mesh background */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-teal-300/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xl relative z-10 glow-blue">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-blue-500/25 mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-2xl tracking-tight text-slate-900">
            Welcome to NudgeDoc
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Access your patient summary dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <span className="bg-white px-3 text-xs font-bold text-slate-400 relative z-10 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google SSO Login */}
        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold py-3.5 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.08 3.59-5.14 3.59-8.46z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.32v3.1A11.996 11.996 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.24a7.222 7.222 0 0 1 0-4.48V6.66H1.32a11.99 11.99 0 0 0 0 10.68l3.92-3.1z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.993 11.993 0 0 0 1.32 6.66l3.92 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
            />
          </svg>
          Sign In with Google
        </button>

        {/* Demo instructions */}
        <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Demo Mode:</strong> You can enter any email/password combination or click Google login. 
            No real accounts will be created; you will be logged into a demo workspace immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
