'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // On login page mount: clear any existing session so the form is always
  // accessible. The user must submit credentials to get to the dashboard.
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.replace('/dashboard');
    } else {
      setErrorMsg(result.message);
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  const isBusy = isSubmitting;

  return (
    <div
      className="min-h-screen relative flex items-center justify-center md:justify-end p-4 md:p-8 lg:pr-12 xl:pr-20 overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-200"
      style={{ backgroundImage: "url('/login.jpg')" }}
    >

      {/* Login Card Container (Pure White UI Box on Right Side) */}
      <div className="relative w-full max-w-md z-10 my-auto">
        <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your Task Management Dashboard</p>
          </div>

          {/* Main Error Banner */}

          {errorMsg && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3.5 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@test.com"
                  autoComplete="email"
                  disabled={isBusy}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${fieldErrors.email
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500'
                    } rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isBusy}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${fieldErrors.password
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500'
                    } rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60`}
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}



