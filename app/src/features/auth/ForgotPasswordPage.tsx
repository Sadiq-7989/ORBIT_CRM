import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API call to send reset email
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSent(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Form Header */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Forgot Password?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Enter your email and we'll send you a password reset link.
        </p>
      </div>

      {/* Success banner */}
      {isSent ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-success/10 text-success border border-success/20 rounded-orbit-button text-xs font-semibold leading-relaxed flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold">
              <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reset Email Sent</span>
            </div>
            <p>
              We've emailed a secure password reset link to <strong className="font-bold">{email}</strong>. Please check your inbox (and spam folder).
            </p>
          </div>
          
          <Link
            to="/login"
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs tracking-wider uppercase rounded-orbit-button hover:opacity-90 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-error/10 text-error border border-error/20 rounded-orbit-button text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
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

            {/* Reset button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs tracking-wider uppercase rounded-orbit-button hover:opacity-90 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/15 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
            <span>Remembered your password? </span>
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </>
      )}

    </div>
  );
}
