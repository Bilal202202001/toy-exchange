export default function SplashScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] relative">
      {/* Decorative background elements for desktop */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-[#00C4D9]/10 rounded-full blur-3xl"></div>

      <div className="flex flex-col items-center justify-center z-10">
        {/* Logo Container */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/90 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,188,212,0.3)] mb-8 transform transition-transform hover:scale-105 duration-500">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sm:scale-125"
          >
            <path
              d="M18.5 7.5C18.5 7.5 16.5 5.5 15 5.5H9C7.5 5.5 5.5 7.5 5.5 7.5L4 12V16.5C4 17.3284 4.67157 18 5.5 18H6.5C7.32843 18 8 17.3284 8 16.5V15.5H16V16.5C16 17.3284 16.6715 18 17.5 18H18.5C19.3284 18 20 17.3284 20 16.5V12L18.5 7.5Z"
              fill="#00C4D9"
            />
            <circle cx="7.5" cy="14.5" r="1.5" fill="white" />
            <circle cx="16.5" cy="14.5" r="1.5" fill="white" />
            <path
              d="M5.5 11H18.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4.5 6.5L2 8.5"
              stroke="#00C4D9"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="2" cy="8.5" r="1" fill="#00C4D9" />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-4">
          <span className="text-slate-800">Toy</span>
          <span className="text-[#00C4D9]">Box</span>
        </h1>

        {/* Tagline */}
        <p className="text-slate-600 text-lg sm:text-xl font-medium tracking-wide">
          Share Joy, Exchange Toys
        </p>
      </div>

      {/* Footer Indicators */}
      <div className="absolute bottom-12 flex flex-col items-center gap-6">
        <div className="flex gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C4D9] animate-pulse"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C4D9]/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C4D9]/40"></div>
        </div>
        <p className="text-xs text-slate-400 font-semibold tracking-[0.2em] uppercase">
          Version 1.0.2
        </p>
      </div>
    </div>
  );
}
