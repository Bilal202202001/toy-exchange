const fieldClassName =
  "w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl text-base border border-slate-200 focus:border-[#00C4D9] focus:bg-white focus:ring-4 focus:ring-[#e0f7fa] outline-none transition-all placeholder-slate-400";

export function FormTextarea({ label, placeholder, icon, rows = 3 }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-5 top-4 text-slate-400 group-focus-within:text-[#00C4D9] transition-colors">
          {icon}
        </div>
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={`${fieldClassName} ${rows <= 2 ? "min-h-[88px] py-3" : "min-h-[120px]"} resize-y`}
        />
      </div>
    </div>
  );
}

export default function FormInput({
  label,
  placeholder,
  icon,
  type = "text",
  min,
  max,
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00C4D9] transition-colors">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          className={fieldClassName}
        />
      </div>
    </div>
  );
}
