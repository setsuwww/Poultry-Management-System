"use client";

import { useState } from "react";
import Login from "@/components/_auth/Login";
import Register from "@/components/_auth/Register";

export default function LandingPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-mist-50 dark:bg-mist-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-mist-950 p-8 rounded-2xl shadow-xl border border-mist-100 dark:border-mist-800">
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center ring-4 ring-orange-50 dark:bg-orange-500/10 dark:text-orange-500 dark:ring-orange-500/10">
                        {/* Simple logo icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                </div>

                {isLogin ? (
                    <Login onSwitch={() => setIsLogin(false)} />
                ) : (
                    <Register onSwitch={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}
