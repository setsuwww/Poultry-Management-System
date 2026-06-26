import React from 'react';

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-mist-900 dark:text-white tracking-tight">Create Account</h2>
        <p className="text-mist-500 dark:text-mist-400 text-sm mt-2">Join Ayam Kita today!</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-mist-700 dark:text-mist-300">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-mist-200 dark:border-mist-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:bg-mist-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-mist-700 dark:text-mist-300">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 border border-mist-200 dark:border-mist-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:bg-mist-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-mist-700 dark:text-mist-300">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 border border-mist-200 dark:border-mist-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:bg-mist-900 dark:text-white"
        />
      </div>

      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.98]">
        Sign Up
      </button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-mist-200 dark:border-mist-700"></div>
        <span className="flex-shrink-0 mx-4 text-mist-400 text-sm">or</span>
        <div className="flex-grow border-t border-mist-200 dark:border-mist-700"></div>
      </div>

      <p className="text-center text-sm text-mist-600 dark:text-mist-400">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-bold transition-colors hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
