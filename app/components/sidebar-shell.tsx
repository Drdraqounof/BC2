"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const teacherNavigationItems = [
  { href: "/active-campaigns", label: "Progress Tracking", shortLabel: "PT" },
  {
    href: "/students",
    label: "Student Management",
    shortLabel: "SM",
    matchPaths: ["/students", "/task-assignment"],
  },
  { href: "/submissions", label: "Submissions", shortLabel: "SB" },
  { href: "/ai-writer", label: "AI Writer", shortLabel: "AI" },
  { href: "/profile", label: "Profile", shortLabel: "PR" },
];

type NavigationItem = {
  href: string;
  label: string;
  shortLabel: string;
  matchPaths?: string[];
};

type SidebarShellProps = {
  children: React.ReactNode;
  workspaceLabel?: string;
  navigationItems?: NavigationItem[];
  logoutRole?: "teacher" | "student";
  logoutStorageKeys?: string[];
  systemNote?: string;
};

export function SidebarShell({
  children,
  workspaceLabel = "Teacher Workspace",
  navigationItems = teacherNavigationItems,
  logoutRole = "teacher",
  logoutStorageKeys,
  systemNote = "Track campaigns, manage students, and review submissions without losing the next intervention step.",
}: SidebarShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const keysToClear = logoutStorageKeys ??
    (logoutRole === "student"
      ? ["edupanel.studentEmail"]
      : ["edupanel.teacherEmail", "edupanel.studentEmail"]);

  const handleLogout = () => {
    keysToClear.forEach((key) => localStorage.removeItem(key));
    setMobileNavOpen(false);
    router.push(`/login?role=${logoutRole}`);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--background)] text-[var(--foreground)] lg:flex-row">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--background)_88%,white)] px-3 py-3 backdrop-blur sm:px-4 lg:hidden">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            EduPanel
          </p>
          <p className="mt-1 text-sm font-semibold tracking-[-0.03em]">
            {workspaceLabel}
          </p>
        </div>
        <button
          type="button"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/70 text-lg text-[var(--foreground)] transition-colors hover:bg-white"
        >
          {mobileNavOpen ? "×" : "☰"}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-20 bg-[rgba(17,32,51,0.34)] transition-opacity duration-300 lg:hidden ${
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[min(20rem,88vw)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel-dark)] px-3 py-4 text-white transition-transform duration-300 sm:w-[min(22rem,78vw)] lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          collapsed ? "lg:w-20" : "lg:w-72"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className={`overflow-hidden transition-all ${collapsed ? "w-auto opacity-100 lg:w-0 lg:opacity-0" : "w-auto opacity-100"}`}
          >
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">EduPanel</p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
              {workspaceLabel}
            </p>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-lg text-white transition-colors hover:bg-white/14 lg:hidden"
          >
            ×
          </button>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-lg text-white transition-colors hover:bg-white/14 lg:flex"
          >
            <span className={`transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}>
              ←
            </span>
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navigationItems.map((item) => {
            const activePaths = item.matchPaths ?? [item.href];
            const isActive = activePaths.some((activePath) => {
              if (pathname === activePath) {
                return true;
              }

              return pathname.startsWith(`${activePath}/`);
            });

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                  isActive
                    ? "bg-[var(--accent-blue)] text-white"
                    : "text-white/74 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold uppercase tracking-[0.14em] ${
                    isActive
                      ? "bg-white/18 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {item.shortLabel}
                </span>
                <span
                  className={`overflow-hidden text-sm font-medium transition-all ${
                    collapsed ? "w-auto opacity-100 lg:w-0 lg:opacity-0" : "w-auto opacity-100"
                  } lg:block`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className={`text-xs uppercase tracking-[0.22em] text-white/55 ${collapsed ? "block lg:sr-only" : "block"}`}>
            System note
          </p>
          <p className={`mt-2 text-sm leading-6 text-white/80 ${collapsed ? "block lg:hidden" : "block"}`}>
            {systemNote}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex items-center gap-3 rounded-2xl border border-white/12 px-3 py-3 text-left text-white/74 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xs font-semibold uppercase tracking-[0.14em]">
            LO
          </span>
          <span
            className={`overflow-hidden text-sm font-medium transition-all ${
              collapsed ? "w-auto opacity-100 lg:w-0 lg:opacity-0" : "w-auto opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </aside>

      <div className="relative flex min-h-[100dvh] flex-1 overflow-x-clip">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[color:color-mix(in_srgb,var(--signal-green)_22%,transparent)] blur-3xl" />
          <div className="absolute right-[-5rem] top-20 h-80 w-80 rounded-full bg-[color:color-mix(in_srgb,var(--signal-red)_18%,transparent)] blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[88rem] flex-1 px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}