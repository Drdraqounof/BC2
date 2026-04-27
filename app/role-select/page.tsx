"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function RoleSelectPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setIsLoading(true);
    // Redirect to login with role parameter
    router.push(`/login?role=${roleId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-slate-900">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between rounded-full border border-stone-200/60 bg-white/75 px-5 py-3 backdrop-blur-md">
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
        </header>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center py-12">
          <section className="w-full max-w-4xl">
            {/* Title Section */}
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-600 font-semibold">
                Get Started
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-slate-950">
                Choose your role
              </h1>
              <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
                Select your role to access the appropriate workspace and features tailored to your needs.
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="relative p-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="text-6xl mb-4">{role.icon}</div>

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
                      {selectedRole === role.id ? "Redirecting..." : "Continue as " + role.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700 underline">
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
