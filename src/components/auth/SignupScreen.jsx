"use client";

import { useRef, useState } from "react";
import {
  Car,
  Mail,
  ArrowLeft,
  Phone,
  Lock,
  Camera,
  MapPin,
  GraduationCap,
  Sparkles,
  Home,
  Calendar,
} from "lucide-react";
import FormInput, { FormTextarea } from "./FormInput";

const TOTAL_STEPS = 4;

export default function SignupScreen({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

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

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-[#e0f7fa]/50 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 z-10 lg:h-[min(820px,90vh)] lg:max-h-[90vh]">
        {/* Left Side: Visual (Desktop only) */}
        <div className="hidden lg:flex flex-1 min-h-0 min-w-0 bg-gradient-to-br from-[#80deea] to-[#00ACC1] p-16 flex-col justify-between text-white relative">
          <div>
            <button
              type="button"
              onClick={goBack}
              className="mb-8 flex items-center gap-2 text-teal-50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">
                {step === 1 ? "Back to Login" : "Back"}
              </span>
            </button>
            <h2 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              {leftCopy[step].title}
            </h2>
            <p className="text-teal-50 text-lg max-w-xs leading-relaxed">
              {leftCopy[step].body}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#00C4D9] rounded-xl flex items-center justify-center">
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
        <div className="w-full lg:w-[600px] lg:shrink-0 flex flex-col min-h-0 lg:h-full lg:max-h-full lg:overflow-hidden p-6 sm:p-8 lg:p-10">
          {step === 1 && (
            <div className="flex flex-col h-full min-h-0 justify-between gap-4">
              <div className="shrink-0">
                <div className="flex items-center gap-4 mb-3 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="p-2 bg-slate-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Create Account</h2>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Join ToyBox</h1>
                  <span className="shrink-0 px-2.5 py-1 bg-[#e0f7fa] text-[#00838F] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#B2EBF2]/80">
                    Step 1 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="text-slate-500 text-sm sm:text-base mb-4">
                  Set up your profile to get started.
                </p>

                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<Car className="w-5 h-5" />}
                  />
                  <FormInput
                    label="Email Address"
                    placeholder="john@example.com"
                    icon={<Mail className="w-5 h-5" />}
                  />
                  <FormInput
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    icon={<Phone className="w-5 h-5" />}
                  />
                  <FormInput
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="shrink-0 pt-2">
                <p className="text-[11px] sm:text-xs text-slate-500 text-center mb-3 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <span className="text-[#00C4D9] cursor-pointer font-semibold hover:text-[#00ACC1] hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#00C4D9] cursor-pointer font-semibold hover:text-[#00ACC1] hover:underline">
                    Privacy Policy
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-[#00C4D9] hover:bg-[#00ACC1] text-white py-3.5 rounded-2xl text-base font-bold shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all active:scale-[0.98]"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full min-h-0 justify-between gap-4">
              <div className="shrink-0">
                <div className="flex items-center gap-4 mb-3 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="p-2 bg-slate-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Profile photo</h2>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Photo</h1>
                  <span className="shrink-0 px-2.5 py-1 bg-[#e0f7fa] text-[#00838F] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#B2EBF2]/80">
                    Step 2 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="text-slate-500 text-sm sm:text-base mb-4">
                  Optional but recommended for trust in the community.
                </p>

                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 hover:border-[#00C4D9]/60 hover:bg-[#e0f7fa]/30 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full bg-[#e0f7fa] flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-9 h-9 text-[#00C4D9]" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-800 text-sm">Tap to upload</p>
                    <p className="text-xs text-slate-500 mt-1">JPG or PNG, up to 5 MB</p>
                  </div>
                </button>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full bg-[#00C4D9] hover:bg-[#00ACC1] text-white py-3.5 rounded-2xl text-base font-bold shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all active:scale-[0.98]"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Back to step 1
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full min-h-0 justify-between gap-4">
              <div className="shrink-0 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-4 mb-3 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="p-2 bg-slate-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">Location</h2>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Location</h1>
                  <span className="shrink-0 px-2.5 py-1 bg-[#e0f7fa] text-[#00838F] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#B2EBF2]/80">
                    Step 3 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="text-slate-500 text-sm sm:text-base mb-4">
                  Address and area for safer local exchanges.
                </p>

                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-4 flex-1 min-h-0">
                  <FormTextarea
                    label="Address"
                    placeholder="Street, city, state / region"
                    rows={2}
                    icon={<MapPin className="w-5 h-5" />}
                  />
                  <FormInput
                    label="City / neighborhood"
                    placeholder="Where you usually meet to exchange"
                    icon={<Home className="w-5 h-5" />}
                  />
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full bg-[#00C4D9] hover:bg-[#00ACC1] text-white py-3.5 rounded-2xl text-base font-bold shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all active:scale-[0.98]"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Back to step 2
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col h-full min-h-0 justify-between gap-4">
              <div className="shrink-0 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-4 mb-3 lg:hidden">
                  <button
                    type="button"
                    onClick={goBack}
                    className="p-2 bg-slate-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-bold text-slate-800">About you</h2>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">About you</h1>
                  <span className="shrink-0 px-2.5 py-1 bg-[#e0f7fa] text-[#00838F] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#B2EBF2]/80">
                    Step 4 of {TOTAL_STEPS}
                  </span>
                </div>
                <p className="text-slate-500 text-sm sm:text-base mb-4">
                  Help others find common ground.
                </p>

                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#00C4D9]" : "bg-slate-100"}`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                  <FormInput
                    label="Qualification"
                    placeholder="e.g. Teacher, Engineer"
                    icon={<GraduationCap className="w-5 h-5" />}
                  />
                  <FormInput
                    label="Interests"
                    placeholder="e.g. educational toys, puzzles"
                    icon={<Sparkles className="w-5 h-5" />}
                  />
                  <div className="sm:col-span-2 max-w-full sm:max-w-xs">
                    <FormInput
                      label="Age"
                      type="number"
                      min={18}
                      max={120}
                      placeholder="e.g. 32"
                      icon={<Calendar className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  className="w-full bg-[#00C4D9] hover:bg-[#00ACC1] text-white py-3.5 rounded-2xl text-base font-bold shadow-[0_20px_40px_rgba(0,196,217,0.25)] transition-all active:scale-[0.98]"
                >
                  Complete signup
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
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
