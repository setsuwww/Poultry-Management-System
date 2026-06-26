import { loginAction } from "@/actions/auth";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-mist-900 dark:text-white tracking-tight">Welcome Back</h2>
        <p className="text-mist-500 dark:text-mist-400 text-sm mt-2">Sign in to your account to continue</p>
      </div>
      
      <form action={async (formData) => {
        const result = await loginAction(formData);
        if (result?.error) {
          alert(result.error);
        } else {
          // Success! Reload to let proxy.ts redirect to dashboard
          window.location.href = "/";
        }
      }}>
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-mist-700 dark:text-mist-300">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-mist-200 dark:border-mist-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:bg-mist-900 dark:text-white"
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-mist-700 dark:text-mist-300">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-mist-200 dark:border-mist-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:bg-mist-900 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-between mt-2 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-orange-500 border-mist-300 focus:ring-orange-500" />
            <span className="text-sm text-mist-600 dark:text-mist-400">Remember me</span>
          </label>
          <a href="#" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 font-semibold hover:underline">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.98]">
          Sign In
        </button>
      </form>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-mist-200 dark:border-mist-700"></div>
        <span className="flex-shrink-0 mx-4 text-mist-400 text-sm">or</span>
        <div className="flex-grow border-t border-mist-200 dark:border-mist-700"></div>
      </div>

      <p className="text-center text-sm text-mist-600 dark:text-mist-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitch}
          className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-bold transition-colors hover:underline"
        >
          Register Now
        </button>
      </p>
    </div>
  );
}
