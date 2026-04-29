/** Base classes — width is `w-full`; parent controls layout width. Theme matches ToyBox (teal focus). */

export const inputBaseClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:ring-2 focus:ring-[#e0f7fa] disabled:cursor-not-allowed disabled:opacity-60 read-only:bg-slate-100";

export const fileDropBaseClass =
  "w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600 transition-colors hover:border-[#00C4D9]/50 hover:bg-[#e0f7fa]/30 focus-within:border-[#00C4D9] focus-within:ring-2 focus-within:ring-[#e0f7fa]";

/** Default label style when using the `label` prop on field components */
export const fieldLabelClass =
  "text-[10px] font-bold uppercase tracking-widest text-slate-500";

/** Space between label and control */
export const fieldGapClass = "mt-1.5";

/** Full-width card shell used by Add toy, Edit profile, etc. */
export const formCardClass =
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white py-4 shadow-sm sm:py-5 lg:py-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8";

export const formTitleClass = "text-lg font-bold text-slate-900 sm:text-xl";
export const formSubtitleClass = "mt-0.5 text-xs text-slate-500 sm:text-sm";

/** Primary / secondary actions — use on form footers for consistency */
export const formButtonSecondaryClass =
  "rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50";

export const formButtonPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#00C4D9] px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#00ACC1] disabled:pointer-events-none disabled:opacity-50";
