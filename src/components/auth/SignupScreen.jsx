"use client";

import { useState } from "react";
import { Car, ArrowLeft } from "lucide-react";
import {
  EmailInput,
  NumberInput,
  PasswordInput,
  SingleImageInput,
  TextareaInput,
  TextInput,
} from "@/components/inputs";
import { profileInitials } from "@/lib/profile";

const TOTAL_STEPS = 4;

const emptySignup = () => ({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  city: "",
  qualification: "",
  interests: "",
  age: "",
});

export default function SignupScreen({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [signup, setSignup] = useState(emptySignup);

  const setField = (key) => (e) =>
    setSignup((s) => ({ ...s, [key]: e.target.value }));

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else onNavigate();
  };

  const leftCopy = {
    1: {
      title: (
        <>
          Start your <br /> contribution.
        </>
      ),
      body: "Create an account to start listing toys, finding treasures, and meeting other parents.",
    },
    2: {
      title: (
        <>
          Add a <br /> friendly face.
        </>
      ),
      body: "A clear photo helps families recognize you when exchanging toys nearby.",
    },
    3: {
      title: (
        <>
          Where you <br /> connect.
        </>
      ),
      body: "Your general location keeps meetups easy—exact address stays private until you choose.",
    },
    4: {
      title: (
        <>
          Tell us <br /> about you.
        </>
      ),
      body: "Interests and background help others find like-minded parents on ToyBox.",
    },
  };

  const primaryCtaClass =
    "w-full rounded-xl bg-[#00C4D9] py-3.5 text-base font-bold text-white shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all hover:bg-[#00ACC1] active:scale-[0.98]";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] p-6 lg:p-12">
      <div className="absolute left-[-5%] top-[-5%] h-[30vw] w-[30vw] rounded-full bg-[#e0f7fa]/50 opacity-60 blur-3xl"></div>

      <div className="z-10 flex w-full max-w-6xl flex-col items-stretch overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 lg:h-[min(820px,90vh)] lg:max-h-[90vh] lg:flex-row">
        {/* Left Side: Visual (Desktop only) */}
        <div className="relative hidden min-h-0 min-w-0 flex-1 flex-col justify-between bg-gradient-to-br from-[#80deea] to-[#00ACC1] p-16 text-white lg:flex">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="group mb-8 flex items-center gap-2 text-teal-50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">
                {step === 1 ? "Back to Login" : "Back"}
              </span>
            </button>
            <h2 className="mb-4 text-4xl font-bold leading-tight xl:text-5xl">
              {leftCopy[step].title}
            </h2>
            <p className="max-w-xs text-lg leading-relaxed text-teal-50">
              {leftCopy[step].body}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C4D9]">
                <Car className="text-white" />
              </div>
              <div>
                <h4 className="font-bold">Fast Exchange</h4>
                <p className="text-xs text-teal-50">Trade toys in minutes locally.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form — no inner scroll; each step fits the fixed height */}
        <div className="flex min-h-0 w-full flex-col p-6 sm:p-8 lg:h-full lg:max-h-full lg:w-[600px] lg:shrink-0 lg:overflow-hidden lg:p-10">
          {step === 1 && (
            <div className="flex h-full min-h-0 flex-col justify-between gap-4">
              <div className="shrink-0">
                <div className="mb-3 flex items-center gap-4 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full bg-slate-100 p-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Create Account</h2>
                </div>

                <div className="mb-1 flex items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Join ToyBox</h1>
                  <span className="shrink-0 rounded-full border border-[#B2EBF2]/80 bg-[#e0f7fa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00838F] sm:text-xs">
                    Step 1 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-500 sm:text-base">
                  Set up your profile to get started.
                </p>

                <div className="mb-4 flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Full name"
                    name="fullName"
                    autoComplete="name"
                    value={signup.fullName}
                    onChange={setField("fullName")}
                    placeholder="John Doe"
                  />
                  <EmailInput
                    label="Email address"
                    name="email"
                    autoComplete="email"
                    value={signup.email}
                    onChange={setField("email")}
                    placeholder="john@example.com"
                  />
                  <TextInput
                    label="Phone number"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={signup.phone}
                    onChange={setField("phone")}
                    placeholder="+1 (555) 000-0000"
                  />
                  <PasswordInput
                    label="Password"
                    name="password"
                    autoComplete="new-password"
                    value={signup.password}
                    onChange={setField("password")}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="shrink-0 pt-2">
                <p className="mb-3 text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                  By creating an account, you agree to our{" "}
                  <span className="cursor-pointer font-semibold text-[#00C4D9] hover:text-[#00ACC1] hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="cursor-pointer font-semibold text-[#00C4D9] hover:text-[#00ACC1] hover:underline">
                    Privacy Policy
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={primaryCtaClass}
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex h-full min-h-0 flex-col justify-between gap-4">
              <div className="shrink-0">
                <div className="mb-3 flex items-center gap-4 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full bg-slate-100 p-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Profile photo</h2>
                </div>

                <div className="mb-1 flex items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Photo</h1>
                  <span className="shrink-0 rounded-full border border-[#B2EBF2]/80 bg-[#e0f7fa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00838F] sm:text-xs">
                    Step 2 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-500 sm:text-base">
                  Optional but recommended for trust in the community.
                </p>

                <div className="mb-4 flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col justify-center">
                <SingleImageInput
                  id="signup-avatar"
                  name="avatar"
                  variant="avatar"
                  accept="image/*"
                  maxSizeBytes={5 * 1024 * 1024}
                  avatarFallback={profileInitials(signup.fullName)}
                  hint="JPG or PNG, up to 5 MB"
                  ariaLabel="Profile photo"
                />
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={primaryCtaClass}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
                >
                  Back to step 1
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex h-full min-h-0 flex-col justify-between gap-4">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="mb-3 flex items-center gap-4 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full bg-slate-100 p-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Location</h2>
                </div>

                <div className="mb-1 flex items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Location</h1>
                  <span className="shrink-0 rounded-full border border-[#B2EBF2]/80 bg-[#e0f7fa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00838F] sm:text-xs">
                    Step 3 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-500 sm:text-base">
                  Address and area for safer local exchanges.
                </p>

                <div className="mb-4 flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4">
                  <TextareaInput
                    label="Address"
                    name="address"
                    autoComplete="street-address"
                    rows={2}
                    value={signup.address}
                    onChange={setField("address")}
                    placeholder="Street, city, state / region"
                    className="min-h-[88px] resize-y py-3"
                  />
                  <TextInput
                    label="City / neighborhood"
                    name="city"
                    autoComplete="address-level2"
                    value={signup.city}
                    onChange={setField("city")}
                    placeholder="Where you usually meet to exchange"
                  />
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className={primaryCtaClass}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
                >
                  Back to step 2
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex h-full min-h-0 flex-col justify-between gap-4">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="mb-3 flex items-center gap-4 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full bg-slate-100 p-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">About you</h2>
                </div>

                <div className="mb-1 flex items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">About you</h1>
                  <span className="shrink-0 rounded-full border border-[#B2EBF2]/80 bg-[#e0f7fa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00838F] sm:text-xs">
                    Step 4 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-500 sm:text-base">
                  Help others find common ground.
                </p>

                <div className="mb-4 flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="grid flex-1 grid-cols-1 content-start gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Qualification"
                    name="qualification"
                    value={signup.qualification}
                    onChange={setField("qualification")}
                    placeholder="e.g. Teacher, Engineer"
                  />
                  <TextInput
                    label="Interests"
                    name="interests"
                    value={signup.interests}
                    onChange={setField("interests")}
                    placeholder="e.g. educational toys, puzzles"
                  />
                  <NumberInput
                    label="Age"
                    name="age"
                    min={18}
                    max={120}
                    value={signup.age}
                    onChange={setField("age")}
                    placeholder="e.g. 32"
                    wrapperClassName="sm:col-span-2 max-w-full sm:max-w-xs"
                  />
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 pt-2">
                <button type="button" className={primaryCtaClass}>
                  Complete signup
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
                >
                  Back to step 3
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
