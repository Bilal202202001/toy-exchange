"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  PlusCircle,
  Inbox,
  User,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { href: "/toybox", label: "Home", icon: Home },
  { href: "/toybox/my-toys", label: "My Toys", icon: PlusCircle },
  { href: "/toybox/requests", label: "Requests", icon: Inbox },
  { href: "/toybox/profile", label: "Profile", icon: User },
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setProfileOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#F8FAFC] font-sans lg:h-screen lg:flex-row">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile; fixed height column on lg (scrolls only if menu overflows) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-100 bg-gradient-to-b from-white via-[#f0fdff] to-[#e0f7fa]/40 shadow-[4px_0_24px_rgba(0,196,217,0.06)] transition-transform duration-300 ease-out lg:relative lg:inset-auto lg:z-auto lg:h-screen lg:min-h-0 lg:translate-x-0 lg:overflow-y-auto lg:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-100/80 px-5 lg:h-[4.5rem]">
          <Link href="/toybox" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00C4D9] shadow-[0_8px_24px_rgba(0,196,217,0.35)]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M18.5 7.5C18.5 7.5 16.5 5.5 15 5.5H9C7.5 5.5 5.5 7.5 5.5 7.5L4 12V16.5C4 17.3284 4.67157 18 5.5 18H6.5C7.32843 18 8 17.3284 8 16.5V15.5H16V16.5C16 17.3284 16.6715 18 17.5 18H18.5C19.3284 18 20 17.3284 20 16.5V12L18.5 7.5Z"
                  fill="white"
                />
                <circle cx="7.5" cy="14.5" r="1.5" fill="#00C4D9" />
                <circle cx="16.5" cy="14.5" r="1.5" fill="#00C4D9" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-slate-800">Toy</span>
              <span className="text-lg font-bold tracking-tight text-[#00C4D9]">Box</span>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-[#e0f7fa] hover:text-[#00838F] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Menu
          </p>
          {nav.map(({ href, label, icon: Icon }) => {
            const third = pathname.split("/")[2];
            const isListingDetail =
              Boolean(third) &&
              !["my-toys", "requests", "profile"].includes(third);
            const active =
              href === "/toybox"
                ? pathname === "/toybox" || isListingDetail
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#e0f7fa] text-[#00838F] shadow-sm ring-1 ring-[#B2EBF2]/80"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${active ? "text-[#00C4D9]" : "text-slate-400"}`}
                  strokeWidth={2}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100/80 p-4">
          <p className="px-3 text-xs text-slate-400">Share Joy, Exchange Toys</p>
        </div>
      </aside>

      {/* Main column — sticky header on mobile; only main scrolls */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
        <header className="sticky top-0 z-40 w-full shrink-0 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md lg:relative lg:z-30">
          <div className="flex h-16 w-full min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
            <button
              type="button"
              className="shrink-0 rounded-xl p-2 text-slate-600 hover:bg-[#e0f7fa] hover:text-[#00838F] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="relative min-w-0 flex-1 sm:w-[40%] sm:flex-none sm:shrink-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search toys, families, listings…"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#00C4D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#e0f7fa]"
                />
              </div>

              <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
                <button
                  type="button"
                  className="relative rounded-2xl p-2.5 text-slate-600 transition-colors hover:bg-[#e0f7fa] hover:text-[#00C4D9]"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#00C4D9] ring-2 ring-white" />
                </button>

                <div className="relative pl-1" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white py-1.5 pl-2 pr-3 shadow-sm transition-all hover:border-[#B2EBF2] hover:shadow-md"
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#80deea] to-[#00C4D9] text-white">
                      <User className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <ChevronDown
                      className={`hidden h-4 w-4 text-slate-500 transition-transform sm:block ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] overflow-hidden rounded-2xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-200/60"
                      role="menu"
                    >
                      <Link
                        href="/toybox/profile"
                        className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#e0f7fa]/60"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                      >
                        View profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
