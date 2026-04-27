"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "teacher";
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    grade: "",
    subject: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const roleConfig: Record<string, any> = {
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
      signUpFields: ["firstName", "lastName", "school", "subject"],
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
      signUpFields: ["firstName", "lastName", "grade"],
      color: "from-purple-600 to-pink-600",
      buttonColor: "bg-purple-700 hover:bg-purple-800",
    },
  };

  const config = roleConfig[role] || roleConfig.teacher;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
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
            <Link href="/role-select" className="text-teal-600 font-semibold">
              Change Role
            </Link>
          </nav>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <section className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left Panel - Info */}
            <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(17,24,39,0.28)] md:p-10">
              <div className="text-4xl mb-4">{config.icon}</div>
              <p className="text-sm uppercase tracking-[0.24em] text-teal-200">
                {role.toUpperCase()}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
                {config.title}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {config.description}
              </p>
              <div className="mt-8 space-y-3">
                {config.features.map((item: string) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                    {isSignUp ? "Get started" : "Welcome back"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
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
                        <>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-700">
                              School/Institution
                            </span>
                            <input
                              type="text"
                              name="school"
                              value={formData.school}
                              onChange={handleInputChange}
                              placeholder="Lincoln High School"
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                              required
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-700">
                              Subject
                            </span>
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              placeholder="Mathematics"
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                              required
                            />
                          </label>
                        </>
                      )}

                      {role === "student" && (
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
                      )}
                    </>
                  )}

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={role === "teacher" ? "teacher@school.edu" : "student@school.edu"}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                  </label>

                  {isSignUp && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm Password
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </label>
                  )}
                </form>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full rounded-2xl px-5 py-3 text-center text-sm font-semibold text-white transition-colors ${config.buttonColor} disabled:opacity-50`}
                >
                  {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                </button>

                <div className="text-center text-sm text-slate-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-semibold text-teal-600 hover:text-teal-700"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}