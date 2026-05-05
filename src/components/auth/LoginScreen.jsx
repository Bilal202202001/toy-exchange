"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { EmailInput, PasswordInput } from "@/components/inputs";

import { useAuth } from "@/contexts/AuthContext";

/** ToyBox auth: teal focus ring, tall control, inner shadow */
const authInputClass =
  "h-14 w-full rounded-xl border-2 border-transparent bg-white py-0 pl-4 pr-12 text-base leading-none text-slate-900 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.05)] outline-none transition-all placeholder:text-slate-400 focus:border-[#00c4d9]/45 focus:ring-0 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400";

const authLabelClass =
  "mb-1.5 ml-1 block text-xs font-semibold text-slate-500 dark:text-slate-400";

export default function LoginScreen({ onNavigate }) {

  const router = useRouter();

  const { signInWithPassword } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await signInWithPassword(email.trim(), password);
    setBusy(false);

    if (res.ok) {

      router.push("/toybox");

      return;

    }

    setError(res.error || "Invalid email or password.");
  };

  return (
    <div
      className="relative flex min-h-[max(884px,100dvh)] w-full flex-col items-center justify-center overflow-hidden bg-auth-bg font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 antialiased dark:bg-auth-bg-dark dark:text-slate-100"
    >
      <div className="absolute left-0 top-0 -z-10 h-64 w-full bg-gradient-to-b from-slate-200/30 to-transparent dark:from-slate-800/20" />
      <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-auth-primary/5 blur-3xl" />
      <div className="absolute -left-20 top-40 -z-10 h-40 w-40 rounded-full bg-slate-200/40 blur-2xl dark:bg-slate-600/20" />

      <main className="relative z-10 flex w-full max-w-md flex-col gap-6 px-6 py-8 sm:px-8 lg:max-w-lg">
        {/* Brand row */}
        <div className="mb-2 flex flex-col items-center justify-center">
          <div className="mb-4 flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl bg-white shadow-[0_4px_20px_-2px_rgba(0,196,217,0.35)] transition-transform duration-300 dark:bg-slate-800">
            <span className="material-symbols-outlined text-4xl leading-none text-auth-primary">
              toys
            </span>
          </div>
          <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
            ToyBox
          </h1>
          <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
            Share the fun, swap the love.
          </p>
        </div>

        {/* Login / Signup segmented control */}
        <div className="flex w-full items-center rounded-xl bg-slate-200/50 p-1.5 shadow-inner dark:bg-slate-800">
          <label className="relative flex-1 cursor-pointer">
            <input
              className="peer sr-only"
              name="auth-mode"
              type="radio"
              value="login"
              defaultChecked
            />
            <div className="w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-slate-500 transition-all peer-checked:bg-white peer-checked:text-slate-900 peer-checked:shadow-sm dark:text-slate-400 dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">
              Login
            </div>
          </label>
          <label className="relative flex-1 cursor-pointer">
            <input
              className="peer sr-only"
              name="auth-mode"
              type="radio"
              value="signup"
              onChange={() => onNavigate()}
            />
            <div className="w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-slate-500 transition-all peer-checked:bg-white peer-checked:text-slate-900 peer-checked:shadow-sm dark:text-slate-400 dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">
              Signup
            </div>
          </label>
        </div>

        <form
          className="mt-2 flex flex-col gap-4"
          onSubmit={handleLogin}
          noValidate
        >
          <div className="group">
            <label className={authLabelClass} htmlFor="login-email">
              Email Address
            </label>
            <div className="relative flex items-center">
              <EmailInput
                id="login-email"
                name="email"
                label={null}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className={`${authInputClass} !rounded-xl !border-2 !border-transparent !bg-white !px-4 !py-0 !text-base !shadow-[0_2px_8px_-1px_rgba(0,0,0,0.05)] focus:!border-[#00c4d9]/45 focus:!ring-0 dark:!bg-slate-800`}
                aria-describedby={error ? "login-error" : undefined}
              />
              <div className="pointer-events-none absolute right-4 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[22px] leading-none">
                  mail
                </span>
              </div>
            </div>
          </div>

          <PasswordInput
            id="login-password"
            name="password"
            label="Password"
            labelClassName={authLabelClass}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            toggleVariant="material"
            className={`${authInputClass} !rounded-xl !border-2 !border-transparent !bg-white !px-4 !py-0 !text-base !shadow-[0_2px_8px_-1px_rgba(0,0,0,0.05)] focus:!border-[#00c4d9]/45 focus:!ring-0 dark:!bg-slate-800`}
            aria-describedby={error ? "login-error" : undefined}
          />

          {error ? (
            <p
              id="login-error"
              className="text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-1 flex justify-end">
            <button
              type="button"
              className="cursor-pointer text-sm font-medium text-slate-400 transition-colors hover:text-auth-primary dark:hover:text-auth-primary-dark"
              onClick={() => {}}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={busy}

            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-auth-primary py-3.5 text-base font-bold text-white shadow-[0_4px_20px_-2px_rgba(0,196,217,0.35)] transition-all duration-200 hover:bg-auth-primary-dark hover:shadow-lg hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
          >
            <span>Login</span>
            <span className="material-symbols-outlined text-xl leading-none">
              arrow_forward
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}
