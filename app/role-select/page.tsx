"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const roles = [
  {
    id: "teacher",
    title: "Teacher",
    icon: "👨‍🏫",
    description: "Manage campaigns, track students, and use AI writing tools",
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "student",
    title: "Student",
    icon: "👨‍🎓",
    description: "View assigned tasks, submit work, and track progress",
    color: "from-purple-600 to-pink-600",
  },
];

function RoleSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action") === "signup" ? "signup" : "login";
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setIsLoading(true);
    router.push(`/${action}?role=${roleId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-slate-900">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-stone-200/60 bg-white/75 px-4 py-3 backdrop-blur-md sm:rounded-full sm:px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-700 to-amber-500">
              <span className="text-sm font-bold text-white">EP</span>
            </div>
            <span className="font-semibold text-slate-900">EduPanel</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
          </nav>
          <div className="flex w-full gap-3 md:hidden">
            <Link href="/" className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:bg-stone-50">
              Home
            </Link>
            <Link href="/features" className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-teal-700">
              Features
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <section className="w-full max-w-4xl">
            {/* Title Section */}
            <div className="mb-10 text-center sm:mb-12">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-600 font-semibold">
                {action === "signup" ? "Create Account" : "Get Started"}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl">
                Choose your role
              </h1>
              <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
                {action === "signup"
                  ? "Select a role to create a new account with the right onboarding form."
                  : "Select your role to sign in to the appropriate workspace and features tailored to your needs."}
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  disabled={isLoading && selectedRole === role.id}
                  className={`group relative overflow-hidden rounded-[24px] border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? "border-slate-400 scale-95"
                      : "border-stone-200 hover:border-stone-300 hover:shadow-lg"
                  }`}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Card content */}
                  <div className="relative flex flex-col items-center p-6 text-center sm:p-8">
                    {/* Icon */}
                    <div className="mb-4 text-5xl sm:text-6xl">{role.icon}</div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                      {role.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      {role.description}
                    </p>

                    {/* CTA Button */}
                    <div className={`inline-flex px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                      selectedRole === role.id
                        ? `bg-gradient-to-r ${role.color} text-white`
                        : `bg-stone-100 text-slate-700 group-hover:bg-stone-200`
                    }`}>
                      {selectedRole === role.id
                        ? "Redirecting..."
                        : action === "signup"
                          ? "Create " + role.title + " Account"
                          : "Continue as " + role.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                {action === "signup" ? "Already have an account? " : "Need an account? "}
                <Link
                  href={action === "signup" ? "/login" : "/role-select?action=signup"}
                  className="font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  {action === "signup" ? "Sign in" : "Create one"}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function RoleSelectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RoleSelectContent />
    </Suspense>
  );
}
