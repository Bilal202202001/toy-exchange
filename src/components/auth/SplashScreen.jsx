export default function SplashScreen() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex h-full max-h-none min-h-[max(884px,100dvh)] w-full select-none flex-col items-center overflow-hidden splash-gradient antialiased [font-family:var(--font-plus-jakarta-sans,sans-serif)] text-slate-900 dark:text-slate-100"
    >
      {/* Background decorative blobs */}
      <div
        aria-hidden
        className="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-[-5%] right-[-10%] h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute right-[10%] top-[20%] h-32 w-32 rounded-full bg-yellow-200/40 blur-2xl dark:bg-yellow-200/15"
      />

      {/* Logo + headline — ring diameter defines icon (~40% of diameter) */}
      <div className="relative z-10 flex w-full max-w-md flex-grow animate-splash-fade-in-up flex-col items-center justify-center px-6">
        <div
          className="relative mb-8 flex shrink-0 items-center justify-center rounded-full bg-white/40 shadow-lg ring-1 ring-white/50 backdrop-blur-md dark:bg-white/5 dark:ring-white/10"
          style={{
            "--splash-ring": "min(14.5rem, 70vw)",
            width: "var(--splash-ring)",
            height: "var(--splash-ring)",
          }}
        >
          <span
            className="material-symbols-outlined text-primary leading-none"
            style={{
              fontSize: "calc(var(--splash-ring) * 0.4)",
              fontVariationSettings:
                "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 96",
            }}
          >
            toys
          </span>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            Toy<span className="text-primary">Box</span>
          </h1>
          <p className="px-4 text-center text-lg font-medium text-slate-600 dark:text-slate-300">
            Share Joy, Exchange Toys
          </p>
        </div>
      </div>

      {/* Loading dots + version */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 px-8 pb-12">
        <div className="flex gap-2">
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/30"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
          v1.0.2
        </p>
      </div>
    </div>
  );
}
