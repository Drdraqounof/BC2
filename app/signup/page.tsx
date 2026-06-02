"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { PASSWORD_REQUIREMENTS_MESSAGE, validatePasswordStrength } from "@/lib/password-policy";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RoleConfig = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  color: string;
  buttonColor: string;
};

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "student";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    school: "",
    grade: "",
    classroomCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = formData.email.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid email address, such as name@gmail.com.");
      return;
    }

    const passwordValidation = validatePasswordStrength(formData.password);

    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || "Password does not meet requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      if (role === "student") {
        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: trimmedEmail,
            password: formData.password,
            grade: formData.grade,
            classroomCode: formData.classroomCode,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create student account");
        }

        router.push("/login?role=student");
      } else if (role === "teacher") {
        const response = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: trimmedEmail,
            password: formData.password,
            school: formData.school,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create teacher account");
        }

        router.push("/login?role=teacher");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const roleConfig: Record<string, RoleConfig> = {
    teacher: {
      icon: "👨‍🏫",
      title: "Teacher Portal",
      subtitle: "Access the EduPanel workspace",
      description: "Sign in to open campaigns, review students, track progress, and use the AI writer.",
      features: [
        "Active campaigns with measurable goals",
        "Student support signals and follow-up status",
        "Progress trends across interventions",
      ],
      color: "from-blue-600 to-cyan-600",
      buttonColor: "bg-blue-700 hover:bg-blue-800",
    },
    student: {
      icon: "👨‍🎓",
      title: "Student Portal",
      subtitle: "Access your tasks and progress",
      description: "Sign in to view assigned tasks, submit work, and track your learning progress.",
      features: [
        "View assigned tasks from your teachers",
        "Submit evidence and track completion",
        "Monitor your learning progress",
      ],
      color: "from-purple-600 to-pink-600",
      buttonColor: "bg-purple-700 hover:bg-purple-800",
    },
  };

  const config = roleConfig[role] || roleConfig.student;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-3 sm:px-6 sm:py-6">
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
            <Link href="/role-select" className="text-teal-600 font-semibold">
              Change Role
            </Link>
          </nav>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:hidden">
            <Link href="/features" className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:bg-stone-50">
              Features
            </Link>
            <Link href="/role-select" className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-teal-700">
              Change Role
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-6 sm:py-12">
          <section className="grid w-full max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
            {/* Left Panel - Info */}
            <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(17,24,39,0.28)] sm:rounded-[32px] sm:p-8 md:p-10">
              <div className="text-4xl mb-4">{config.icon}</div>
              <p className="text-sm uppercase tracking-[0.24em] text-teal-200">
                {role.toUpperCase()}
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {config.title}
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:leading-7">
                {config.description}
              </p>
              <div className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
                {config.features.map((item: string) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-[32px] sm:p-8 md:p-10">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    Create Account
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                    Get started
                  </h2>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Create Password
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        minLength={8}
                        placeholder="8+ chars, uppercase, number, symbol"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                      <span className="mt-2 block text-xs text-slate-500">
                        {PASSWORD_REQUIREMENTS_MESSAGE}
                      </span>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm Password
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        First Name
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Last Name
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </label>
                  </div>

                  {role === "teacher" && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        School
                      </span>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        placeholder="Your school name"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </label>
                  )}

                  {role === "student" && (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                          Grade
                        </span>
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                          required
                        >
                          <option value="">Select your grade</option>
                          <option value="9">Grade 9</option>
                          <option value="10">Grade 10</option>
                          <option value="11">Grade 11</option>
                          <option value="12">Grade 12</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                          Classroom Code
                        </span>
                        <input
                          type="text"
                          name="classroomCode"
                          value={formData.classroomCode}
                          onChange={handleInputChange}
                          placeholder="Enter your classroom code"
                          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                          required
                        />
                      </label>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-2xl px-5 py-3 text-center text-sm font-semibold text-white transition-colors ${config.buttonColor} disabled:opacity-50`}
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </button>
                </form>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push(`/login?role=${role}`)}
                    className="font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Sign in
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-stone-200">
                  <Link href="/features" className="hover:text-slate-900">
                    View product features
                  </Link>
                  <Link href="/role-select" className="hover:text-slate-900 font-semibold text-teal-600">
                    Change role
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
