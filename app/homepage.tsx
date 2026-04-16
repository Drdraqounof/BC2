import Link from "next/link";

const stats = [
  { value: "2.4k", label: "campaigns", context: "launched weekly" },
  { value: "18k", label: "issues", context: "surfaced early" },
  { value: "9 hrs", label: "saved", context: "per teacher per week" },
];

const problems = [
  {
    icon: "⚡",
    problem: "Teachers drown in data",
    reality: "Your LMS throws endless dashboards at you. Grades, attendance, engagement scores. Which one matters right now?",
  },
  {
    icon: "⏰",
    problem: "Time disappears into admin",
    reality: "Finding struggling students, reaching out to families, tracking tiny improvements—it's invisible labor that never ends.",
  },
  {
    icon: "📉",
    problem: "Interventions go nowhere",
    reality: "You try to help, but without a clear goal or way to measure progress, students slip through anyway.",
  },
];

const features = [
  {
    title: "See Every Intervention",
    description: "One place. One view. Current campaigns with goals, students, and status. No hunting.",
    icon: "👁️",
  },
  {
    title: "Spot Issues Before They Grow",
    description: "Missing work. Attendance drops. At-risk patterns. EduPanel surfaces what needs attention today.",
    icon: "🎯",
  },
  {
    title: "Launch a Campaign in Minutes",
    description: "Choose issue → Set goal → Pick students → Go. No complex forms. No training.",
    icon: "🚀",
  },
  {
    title: "Know If It's Working",
    description: "Trend views for completion, attendance, readiness. See if your intervention is moving the needle.",
    icon: "📊",
  },
  {
    title: "Write Better Outreach",
    description: "AI-drafted messages and notes that keep classroom context instead of sounding like a bot.",
    icon: "✍️",
  },
  {
    title: "Stop Second-Guessing",
    description: "Goal-based interventions replace informal guesswork. Every action has a reason and a way to measure it.",
    icon: "✅",
  },
];

const campaignExamples = [
  "Missing Assignments Recovery",
  "Attendance Improvement",
  "Test Preparation Initiative",
  "Student Performance Boost",
  "Parent Engagement Push",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-cyan-100 opacity-20 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/75 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-700 to-amber-500">
                <span className="font-bold text-sm text-black">EP</span>
              </div>
              <span className="font-semibold text-black">EduPanel</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-black">
              <a href="#features" className="transition hover:text-black">Features</a>
              <a href="#" className="transition hover:text-black">Learn More</a>
              <Link
                href="/login"
                className="rounded-full bg-amber-200 px-4 py-2 font-medium text-black transition-colors hover:bg-amber-300"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black">
                For Teachers Who Want Better Results
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-black md:text-6xl">
                Move from data to action.
              </h1>
              <p className="mb-8 max-w-xl text-xl leading-relaxed text-black">
                EduPanel turns classroom insights into focused interventions. See what needs attention, launch help quickly, and know if it's working.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/features"
                  className="cursor-pointer rounded-lg bg-amber-200 px-8 py-4 text-center font-semibold text-black transition-all hover:scale-105 hover:bg-amber-300 hover:shadow-lg"
                >
                  Explore Features
                </Link>
                <Link
                  href="/active-campaigns"
                  className="cursor-pointer rounded-lg border-2 border-amber-300 bg-white px-8 py-4 text-center font-semibold text-black transition hover:border-amber-500 hover:bg-amber-50"
                >
                  View Live Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-300 to-amber-300 opacity-25 blur-2xl"></div>
              <div className="relative rounded-2xl border border-stone-200 bg-white p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-3 w-3/4 rounded bg-teal-200"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-lg bg-amber-100"></div>
                      <div className="flex-1">
                        <div className="mb-2 h-2 w-1/2 rounded bg-slate-300"></div>
                        <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-stone-100 via-amber-50 to-teal-100 py-16 text-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="mb-2 text-5xl font-bold text-black">
                    {stat.value}
                  </div>
                  <div className="mb-1 text-sm font-semibold uppercase tracking-widest text-black">
                    {stat.label}
                  </div>
                  <p className="text-black">{stat.context}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
              Why Teachers Are Stuck
            </h2>
            <p className="text-xl text-black">
              The problem isn't missing data. It's missing clarity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((p) => (
              <div
                key={p.problem}
                className="cursor-pointer rounded-2xl border-2 border-stone-200 bg-white p-8 transition hover:border-teal-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="mb-3 text-2xl font-bold text-black">{p.problem}</h3>
                <p className="leading-relaxed text-black">{p.reality}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-stone-100/85 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
                How EduPanel Works
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-black">
                Six capabilities that turn observations into measurable improvements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-8 transition-hover hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="mb-3 text-2xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-black">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campaign Examples */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-teal-50 p-12">
            <h2 className="mb-2 text-3xl font-bold text-black md:text-4xl">
              Launch Any Type of Intervention
            </h2>
            <p className="mb-8 max-w-2xl text-black">
              Whether it's academic support, attendance recovery, or parent outreach—campaigns give you a structured way to respond.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {campaignExamples.map((example) => (
                <div
                  key={example}
                  className="cursor-pointer rounded-xl border border-amber-100 bg-white px-4 py-3 text-center text-sm font-medium text-black transition hover:border-teal-300"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-stone-100 via-amber-50 to-stone-200 py-20 text-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="mb-4 text-4xl font-bold text-black">1</div>
                <h3 className="text-2xl font-bold mb-3">Priority is Clear</h3>
                <p className="text-black">
                  Stop wondering which issue deserves attention first. EduPanel highlights what's urgent.
                </p>
              </div>
              <div>
                <div className="mb-4 text-4xl font-bold text-black">2</div>
                <h3 className="text-2xl font-bold mb-3">Interventions Have Purpose</h3>
                <p className="text-black">
                  Every action has a goal and a student group. No more informal, inconsistent support.
                </p>
              </div>
              <div>
                <div className="mb-4 text-4xl font-bold text-black">3</div>
                <h3 className="text-2xl font-bold mb-3">Outcomes Are Measurable</h3>
                <p className="text-black">
                  Track progress over time instead of watching results disappear into dashboards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-stone-50 to-teal-100 p-12 text-center text-black md:p-16">
            <h2 className="mb-6 text-4xl font-bold text-black md:text-5xl">
              Ready to stop drowning in data?
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-black">
              See how teachers are using EduPanel to turn insights into action and actually move the needle for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/features"
                className="cursor-pointer rounded-lg bg-white px-8 py-4 text-center font-bold text-black transition hover:bg-amber-50"
              >
                Explore Features
              </Link>
              <Link
                href="/active-campaigns"
                className="cursor-pointer rounded-lg border-2 border-stone-400 bg-white px-8 py-4 text-center font-bold text-black transition hover:bg-stone-100"
              >
                Try the Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-stone-50/80 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-black">
            <p>EduPanel • Helping teachers move from insight to action</p>
          </div>
        </footer>
      </div>
    </main>
  );
}