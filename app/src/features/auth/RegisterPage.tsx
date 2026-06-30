import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      let message = 'Failed to create an account.';
      const errMsg = err?.message || '';
      if (errMsg.includes('User already registered') || errMsg.includes('already exists')) {
        message = 'An account with this email already exists.';
      } else if (errMsg.includes('Password should be') || errMsg.includes('weak') || errMsg.includes('should be at least')) {
        message = 'Weak password. It must be at least 6 characters.';
      } else if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError') || errMsg.includes('network')) {
        message = 'Network failure. Please check your internet connection.';
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Form Header */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Create Account
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Join Orbit and unlock your team's workspace dashboard.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-error/10 text-error border border-error/20 rounded-orbit-button text-xs font-bold flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
        
        {/* Full Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 mt-4 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs tracking-wider uppercase rounded-orbit-button hover:opacity-90 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/15 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
        <span>Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline font-bold">
          Sign In
        </Link>
      </div>

    </div>
  );
}
