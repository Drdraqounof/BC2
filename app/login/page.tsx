import Link from "next/link";

export default function LoginPage() {
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
          </nav>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <section className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(17,24,39,0.28)] md:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-200">
                Login
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
                Access the EduPanel workspace.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Sign in to open campaigns, review students, track progress, and use the AI writer from your teacher workspace.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Active campaigns with measurable goals",
                  "Student support signals and follow-up status",
                  "Progress trends across interventions",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    Teacher sign in
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                    Welcome back
                  </h2>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      placeholder="teacher@school.edu"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </span>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                    />
                  </label>
                </div>

                <Link
                  href="/active-campaigns"
                  className="block rounded-2xl bg-teal-700 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-800"
                >
                  Sign In
                </Link>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <Link href="/features" className="hover:text-slate-900">
                    View product features
                  </Link>
                  <Link href="/" className="hover:text-slate-900">
                    Back to home
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