"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const teacherNavigationItems = [
  { href: "/active-campaigns", label: "Active Campaigns", shortLabel: "AC" },
  { href: "/task-assignment", label: "Tasks", shortLabel: "TK" },
  { href: "/progress-tracking", label: "Progress Tracking", shortLabel: "PT" },
  { href: "/students", label: "Students", shortLabel: "ST" },
  { href: "/ai-writer", label: "AI Writer", shortLabel: "AI" },
];

type SidebarShellProps = {
  children: React.ReactNode;
  workspaceLabel?: string;
  navigationItems?: Array<{ href: string; label: string; shortLabel: string }>;
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
  systemNote = "Campaigns turn signals into action, so every page keeps the next intervention visible.",
}: SidebarShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const keysToClear = logoutStorageKeys ??
    (logoutRole === "student"
      ? ["edupanel.studentEmail"]
      : ["edupanel.teacherEmail", "edupanel.studentEmail"]);

  const handleLogout = () => {
    keysToClear.forEach((key) => localStorage.removeItem(key));
    router.push(`/login?role=${logoutRole}`);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel-dark)] px-3 py-4 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <Link
            href="/"
            className={`overflow-hidden transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">EduPanel</p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
              {workspaceLabel}
            </p>
          </Link>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-lg text-white transition-colors hover:bg-white/14"
          >
            <span className={`transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}>
              ←
            </span>
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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
                    collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className={`text-xs uppercase tracking-[0.22em] text-white/55 ${collapsed ? "sr-only" : "block"}`}>
            System note
          </p>
          <p className={`mt-2 text-sm leading-6 text-white/80 ${collapsed ? "hidden" : "block"}`}>
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
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </aside>

      <div className="relative flex min-h-screen flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[color:color-mix(in_srgb,var(--signal-green)_22%,transparent)] blur-3xl" />
          <div className="absolute right-[-5rem] top-20 h-80 w-80 rounded-full bg-[color:color-mix(in_srgb,var(--signal-red)_18%,transparent)] blur-3xl" />
        </div>
        <div className="relative flex-1 px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}