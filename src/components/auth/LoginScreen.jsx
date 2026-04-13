"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Mail, EyeOff, ArrowRight } from "lucide-react";

const LOGIN_EMAIL = "sabahat_hussain@gmail.com";
const LOGIN_PASSWORD = "sabahat@123";

export default function LoginScreen({ onNavigate }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const emailOk =
      email.trim().toLowerCase() === LOGIN_EMAIL.toLowerCase();
    const passOk = password === LOGIN_PASSWORD;
    if (emailOk && passOk) {
      router.push("/toybox");
      return;
    }
    setError("Invalid email or password.");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] p-6 lg:p-12">
      {/* Dynamic Background elements for Auth screens */}
      <div className="absolute left-[-5%] top-[-5%] h-[30vw] w-[30vw] rounded-full bg-[#e0f7fa]/50 opacity-60 blur-3xl"></div>
      <div className="absolute bottom-[-5%] right-[-5%] h-[35vw] w-[35vw] rounded-full bg-[#00C4D9]/10 opacity-60 blur-3xl"></div>

      <div className="z-10 flex w-full max-w-6xl flex-col items-stretch overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 lg:h-[min(820px,90vh)] lg:max-h-[90vh] lg:flex-row">
        {/* Left Side: Marketing/Visual (Desktop only) */}
        <div className="relative hidden min-h-0 min-w-0 flex-1 flex-col justify-between bg-gradient-to-br from-[#80deea] to-[#00C4D9] p-16 text-white lg:flex">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <Car size={300} strokeWidth={0.5} />
          </div>

          <div>
            <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 7.5C18.5 7.5 16.5 5.5 15 5.5H9C7.5 5.5 5.5 7.5 5.5 7.5L4 12V16.5C4 17.3284 4.67157 18 5.5 18H6.5C7.32843 18 8 17.3284 8 16.5V15.5H16V16.5C16 17.3284 16.6715 18 17.5 18H18.5C19.3284 18 20 17.3284 20 16.5V12L18.5 7.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="mb-6 text-5xl font-bold leading-tight">
              Giving old toys <br /> a new home.
            </h2>
            <p className="max-w-sm text-xl leading-relaxed text-teal-50">
              Join thousands of families exchanging joy and building a sustainable
              community.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#4DD0E1] bg-[#B2EBF2]"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="user"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-teal-50">Joined by 10k+ parents</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex min-h-0 w-full flex-col justify-center p-8 sm:p-12 lg:h-full lg:w-[600px] lg:shrink-0 lg:overflow-y-auto lg:p-16">
          <div className="mb-10 flex flex-col items-center lg:items-start">
            <h2 className="mb-2 text-4xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-lg text-slate-500">Login to continue your toy journey.</p>
          </div>

          {/* Tabs */}
          <div className="mb-10 flex rounded-2xl bg-slate-100/80 p-1.5">
            <button
              type="button"
              className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onNavigate}
              className="flex-1 rounded-xl py-3 text-sm font-medium text-slate-500 transition-all hover:text-slate-700"
            >
              Signup
            </button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin} noValidate>
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                Email Address
              </label>
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-5 pr-12 text-base outline-none transition-all placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
                />
                <Mail className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00C4D9]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-600">
                Password
              </label>
              <div className="group relative">
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-5 pr-12 text-base outline-none transition-all placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa]"
                />
                <EyeOff className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00C4D9]" />
              </div>
            </div>

            {error ? (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-[#00C4D9] transition-colors hover:text-[#00ACC1]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#00C4D9] py-4 text-lg font-bold text-white shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all hover:bg-[#00ACC1] active:scale-[0.98]"
            >
              Login
              <ArrowRight className="h-6 w-6" />
            </button>

            <div className="mt-8 border-t border-slate-100 pt-8 text-center">
              <p className="text-slate-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigate}
                  className="font-bold text-[#00C4D9] hover:text-[#00ACC1] hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
