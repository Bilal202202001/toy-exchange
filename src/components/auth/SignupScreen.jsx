"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profileInitials } from "@/lib/profile";

const TOTAL_STEPS = 2;

const SOFT_SHADOW =
  "shadow-[0_4px_20px_-2px_rgba(99,166,233,0.15)]";

const signupInputClass =
  `flex h-14 w-full resize-none rounded-xl border-0 bg-signup-surface py-0 pl-12 pr-4 text-base font-medium leading-normal outline-none transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-signup-primary/50 dark:bg-signup-surface-dark dark:text-slate-100 dark:placeholder:text-slate-400 ${SOFT_SHADOW}`.trim();

const signupLabelClass =
  "text-sm font-bold text-slate-900 dark:text-slate-100 ml-1";

function IconInput({
  id,
  label,
  icon,
  type = "text",
  name,
  autoComplete,
  inputMode,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={signupLabelClass}>
        {label}
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-slate-400 transition-colors group-focus-within:text-signup-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={signupInputClass}
        />
      </div>
    </div>
  );
}

const emptySignup = () => ({
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  userName: "",
  address: "",
});

export default function SignupScreen({ onNavigate }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [signup, setSignup] = useState(emptySignup);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const avatarInputRef = useRef(null);

  const setField =
    (key) =>
    (e) =>
      setSignup((s) => ({ ...s, [key]: e.target.value }));

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const goBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
    else onNavigate();
  };

  const handleAvatarFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleContinueStep1 = () => {
    setError("");
    if (
      !signup.email.trim() ||
      !signup.phone.trim() ||
      !signup.password ||
      !signup.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (signup.password !== signup.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStep(2);
  };

  const handleFinish = () => {
    setError("");
    if (!signup.userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!signup.address.trim()) {
      setError("Please enter your address.");
      return;
    }
    router.push("/toybox");
  };

  const initials =
    profileInitials(signup.userName) ||
    profileInitials(signup.email) ||
    "?";

  const headerTitle =
    step === 1 ? "Create Account" : "Set Up Profile";

  const footerButtonLabel = step === 1 ? "Continue" : "Save & Continue";

  const footerAction =
    step === 1 ? handleContinueStep1 : handleFinish;

  return (
    <div
      className="relative flex min-h-[max(884px,100dvh)] w-full flex-col items-center justify-center overflow-hidden bg-signup-bg py-6 font-[family-name:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 antialiased dark:bg-signup-bg-dark dark:text-slate-100 sm:py-8 lg:py-12"
    >
      {/* Web backdrop — same pattern as login (soft gradients + blurred orbs) */}
      <div className="absolute left-0 top-0 -z-10 h-64 w-full bg-gradient-to-b from-slate-200/30 to-transparent dark:from-slate-800/20" />
      <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-signup-primary/10 blur-3xl" />
      <div className="absolute -left-20 top-40 -z-10 h-40 w-40 rounded-full bg-slate-200/40 blur-2xl dark:bg-slate-600/20" />

      {/* Centered panel — matches login: max-w-md with lg:max-w-lg on wide viewports */}
      <div className="relative z-10 flex w-full max-w-md flex-col px-6 sm:px-8 lg:max-w-lg">
        <div
          className="relative flex min-h-[min(100dvh,100svh)] w-full flex-col overflow-hidden border-0 bg-signup-bg shadow-none outline-none ring-0 dark:bg-signup-bg-dark lg:min-h-[min(820px,90vh)] lg:max-h-[90vh]"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-signup-bg/95 p-4 pb-2 backdrop-blur-md dark:bg-signup-bg-dark/95">
              <button
                type="button"
                aria-label="Go back"
                onClick={goBack}
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-[24px] leading-none">
                  arrow_back
                </span>
              </button>
              <h2 className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-[-0.015em]">
                {headerTitle}
              </h2>
            </header>

            <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 px-8 py-4">
              <div className="flex w-full gap-2">
                <div
                  className={
                    step === 1
                      ? "h-2 flex-1 rounded-full bg-signup-primary shadow-[0_0_10px_rgba(99,166,233,0.4)]"
                      : "h-2 flex-1 rounded-full bg-signup-primary/90"
                  }
                />
                <div
                  className={
                    step === 2
                      ? "h-2 flex-1 rounded-full bg-signup-primary shadow-[0_0_10px_rgba(99,166,233,0.4)]"
                      : "h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"
                  }
                />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>

            {step === 1 ? (
              <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-4">
                <div className="pb-8 pt-2 lg:pt-4">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 lg:text-[1.75rem]">
                    Join ToyBox
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Start exchanging and donating toys today.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <IconInput
                    id="signup-email"
                    label="Email"
                    icon="mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="example@email.com"
                    value={signup.email}
                    onChange={setField("email")}
                  />
                  <IconInput
                    id="signup-phone"
                    label="Phone Number"
                    icon="call"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 000-0000"
                    value={signup.phone}
                    onChange={setField("phone")}
                  />
                  <IconInput
                    id="signup-password"
                    label="Password"
                    icon="lock"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={signup.password}
                    onChange={setField("password")}
                  />
                  <IconInput
                    id="signup-confirm"
                    label="Confirm Password"
                    icon="lock_reset"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={signup.confirmPassword}
                    onChange={setField("confirmPassword")}
                  />
                </div>

                {error ? (
                  <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}

                <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  By clicking Continue, you agree to our Terms and Privacy
                  Policy.
                </p>
              </main>
            ) : (
              <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-4">
                <div className="flex w-full flex-col items-center gap-6 py-6">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="Choose profile photo"
                    onChange={(e) => handleAvatarFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    className="group relative cursor-pointer border-0 bg-transparent p-0"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <div
                      className="relative h-36 w-36 overflow-hidden rounded-full bg-slate-100 bg-cover bg-center bg-no-repeat shadow-[0_4px_20px_-2px_rgba(99,166,233,0.15)] dark:bg-slate-800 lg:h-40 lg:w-40"
                      style={
                        avatarPreview
                          ? { backgroundImage: `url(${avatarPreview})` }
                          : undefined
                      }
                    >
                      {!avatarPreview ? (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          {initials}
                        </div>
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30" />
                    </div>
                    <div className="absolute bottom-1 right-1 flex items-center justify-center rounded-full bg-signup-primary p-2.5 text-white shadow-lg transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-[20px] leading-none">
                        add_a_photo
                      </span>
                    </div>
                  </button>
                  <div className="text-center">
                    <p className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                      Add a photo
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Show us your smile!
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-6">
                  <IconInput
                    id="signup-username"
                    label="User Name"
                    icon="person"
                    name="userName"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={signup.userName}
                    onChange={setField("userName")}
                  />
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="signup-address"
                      className={signupLabelClass}
                    >
                      Address
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-slate-400 transition-colors group-focus-within:text-signup-primary">
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                      </div>
                      <input
                        id="signup-address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        placeholder="City, State"
                        value={signup.address}
                        onChange={setField("address")}
                        className={signupInputClass}
                      />
                    </div>
                    <p className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                      Used to find toy exchanges near you.
                    </p>
                  </div>
                </div>

                {error ? (
                  <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </main>
            )}

            {/* In-card footer (web-safe) instead of viewport-fixed — matches centered login sheet */}
            <div className="pointer-events-none shrink-0 bg-gradient-to-t from-signup-bg via-signup-bg/95 to-transparent p-6 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] dark:from-signup-bg-dark dark:via-signup-bg-dark/95">
              <button
                type="button"
                onClick={footerAction}
                className="pointer-events-auto flex h-14 w-full items-center justify-center rounded-xl bg-signup-primary text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(99,166,233,0.5)] transition-all hover:bg-signup-primary/90 active:scale-[0.98]"
              >
                {footerButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
