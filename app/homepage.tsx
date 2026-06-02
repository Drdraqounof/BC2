import Link from "next/link";

const stats = [
  { value: "2.4K", label: "Campaigns Launched", context: "Weekly deployment rate" },
  { value: "18K", label: "Issues Surfaced Early", context: "Before escalation" },
  { value: "9h", label: "Time Saved Weekly", context: "Per educator" },
];

const problems = [
  {
    icon: "📊",
    problem: "Data Overload",
    reality: "LMS dashboards present fragmented metrics without actionable insight. Educators struggle to identify what truly matters for each student.",
  },
  {
    icon: "⏳",
    problem: "Administrative Burden",
    reality: "Manual identification of struggling students and family outreach consumes hours—effort that remains invisible in student outcome data.",
  },
  {
    icon: "❌",
    problem: "Unvalidated Interventions",
    reality: "Well-intentioned support often lacks clear objectives or measurement frameworks, resulting in inconsistent outcomes.",
  },
];

const features = [
  {
    title: "Unified Intervention Dashboard",
    description: "Centralized view of active campaigns, goals, student cohorts, and real-time status—eliminating the need to navigate multiple systems.",
    icon: "👁️",
  },
  {
    title: "Predictive Issue Detection",
    description: "AI-powered analysis identifies missing work patterns, attendance anomalies, and at-risk student behaviors before they compound.",
    icon: "🎯",
  },
  {
    title: "Rapid Campaign Deployment",
    description: "Template-driven workflow reduces setup time from hours to minutes. Issue selection → goal definition → cohort assignment → activate.",
    icon: "🚀",
  },
  {
    title: "Outcome Tracking & Analytics",
    description: "Trend visualization for completion, attendance, and readiness metrics. Validate intervention effectiveness with statistical clarity.",
    icon: "📈",
  },
  {
    title: "Intelligent Communication",
    description: "AI-assisted messaging preserves classroom context while maintaining professional tone. Generate outreach at scale without losing personalization.",
    icon: "📧",
  },
  {
    title: "Evidence-Based Practice",
    description: "Replace intuition with structured goals. Every intervention is documented with baseline metrics, cohort definition, and measurable objectives.",
    icon: "✓",
  },
];

const userStories = [
  {
    persona: "Sarah Chen",
    role: "Secondary Math Teacher",
    story: "Every Friday, Sarah uses EduPanel to identify students falling behind in the current unit. The system flags 5 students with missing assignments and shows attendance patterns. Instead of spending 90 minutes crafting individual emails, she creates a campaign in 5 minutes, assigns targeted tasks, and AI generates personalized outreach. By Monday, she sees which students engaged with the support—and can adjust her approach.",
    insight: "From reaction to strategy",
    color: "from-blue-50 to-blue-100",
  },
  {
    persona: "Jordan Martinez",
    role: "High School Student",
    story: "Jordan logs into EduPanel's student dashboard and sees 3 assigned tasks tied to an Attendance Improvement campaign. The interface clearly shows he's at 72% progress and what he needs to complete. He submits evidence of his work, gets feedback from his teacher within 24 hours, and watches his progress bar fill up. The milestone notifications feel like wins, not surveillance.",
    insight: "From tracking to growth",
    color: "from-green-50 to-green-100",
  },
  {
    persona: "Dr. James Wilson",
    role: "School Administrator",
    story: "James reviews teacher reports in EduPanel to understand school-wide intervention patterns. He sees that attendance campaigns have a 78% success rate but grade recovery campaigns need refinement. He schedules professional development on intervention design based on real data. EduPanel becomes the foundation for evidence-based school improvement.",
    insight: "From data to policy",
    color: "from-purple-50 to-purple-100",
  },
];

const campaignTypes = [
  "Missing Assignment Recovery",
  "Attendance Intervention",
  "Assessment Readiness",
  "Engagement Improvement",
  "Family Communication",
];

const benefits = [
  {
    number: "1",
    title: "Clarity on Priorities",
    description: "Automated triage surfaces the highest-impact interventions, enabling educators to allocate effort strategically.",
  },
  {
    number: "2",
    title: "Structured Support",
    description: "Goal-driven campaigns replace ad-hoc assistance. Each intervention has defined success criteria and assigned accountability.",
  },
  {
    number: "3",
    title: "Measurable Impact",
    description: "Track intervention progress continuously. Replace anecdotal observations with quantifiable evidence of student improvement.",
  },
  {
    number: "4",
    title: "Organized Workflow",
    description: "Task management tied to campaigns. Track completion status and student progress at a glance.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50 text-black animate-fade-in">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-100 opacity-25 mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-amber-100 opacity-25 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-cyan-100 opacity-20 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/75 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-700 to-amber-500 shadow-sm">
                <span className="font-bold text-sm text-white">EP</span>
              </div>
              <span className="font-semibold text-lg text-black">EduPanel</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
              <a href="#features" className="transition hover:text-black">
                Features
              </a>
              <a href="#benefits" className="transition hover:text-black">
                Benefits
              </a>
              <Link
                href="/role-select?action=signup"
                className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 font-semibold text-black transition-colors hover:border-teal-300 hover:bg-teal-50 shadow-sm"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-amber-200 px-5 py-2.5 font-semibold text-black transition-colors hover:bg-amber-300 shadow-sm"
              >
                Sign In
              </Link>
            </div>
            <div className="flex w-full gap-3 md:hidden">
              <Link
                href="/role-select?action=signup"
                className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:border-teal-300 hover:bg-teal-50 shadow-sm"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="flex-1 rounded-lg bg-amber-200 px-4 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-amber-300 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-32">
          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 inline-block">
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-black sm:text-5xl md:text-6xl">
                From Data to Impact
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-black sm:text-lg">
                EduPanel transforms student data into structured interventions. Identify at-risk students, launch targeted support, and measure outcomes—all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/role-select?action=signup"
                  className="rounded-lg bg-amber-200 px-8 py-3.5 text-center font-semibold text-black transition-all hover:bg-amber-300 hover:shadow-lg shadow-sm"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border-2 border-stone-300 bg-white px-8 py-3.5 text-center font-semibold text-black transition hover:border-teal-300 hover:bg-teal-50"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-up">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-300 to-amber-300 opacity-25 blur-2xl"></div>
              <div className="relative rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block mb-3">
                      Active Campaign
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">Missing Assignments Recovery</h3>
                    <p className="text-sm text-black/75">Goal: Reduce missing work instances to 2 by Friday</p>
                  </div>

                  <div className="pt-6 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-black">Progress</span>
                      <span className="text-sm font-bold text-teal-600">72%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-200">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 animate-fill-progress"
                        style={{ width: "72%", animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-stone-200 pt-6 sm:gap-6">
                    <div>
                      <div className="text-2xl font-bold text-black">8</div>
                      <div className="text-xs text-black/60 font-medium">Students Enrolled</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-black">3</div>
                      <div className="text-xs text-black/60 font-medium">Action Items</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-stone-100 via-amber-50 to-teal-100 py-16 text-black sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 md:grid-cols-3 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-3 text-4xl font-bold text-amber-600 sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-black">
                    {stat.label}
                  </div>
                  <p className="text-black/75">{stat.context}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
              Common Challenges
            </h2>
            <p className="mx-auto max-w-2xl text-base text-black/75 sm:text-lg">
              Educators today face obstacles that existing tools don't address.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {problems.map((p, idx) => (
              <div
                key={p.problem}
                className="rounded-xl border-2 border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-teal-300 hover:shadow-lg animate-slide-up cursor-pointer sm:p-8"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-black">{p.problem}</h3>
                <p className="leading-relaxed text-black/75">{p.reality}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-stone-100/85 py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                Platform Capabilities
              </h2>
              <p className="mx-auto max-w-2xl text-base text-black/75 sm:text-lg">
                Six core features designed to streamline intervention management and improve student outcomes.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {features.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-teal-300 hover:shadow-lg animate-slide-up cursor-pointer sm:p-8"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="mb-3 text-xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-black/75">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Stories Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
              How EduPanel Works In Practice
            </h2>
            <p className="mx-auto max-w-2xl text-base text-black/75 sm:text-lg">
              Real workflows showing how educators and students benefit from structured interventions.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {userStories.map((story, idx) => (
              <div
                key={story.persona}
                className={`rounded-2xl border-2 border-stone-200 bg-gradient-to-br ${story.color} p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-lg animate-slide-up cursor-pointer sm:p-8`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black sm:text-xl">{story.persona}</h3>
                  <p className="text-sm font-semibold text-black/70">{story.role}</p>
                </div>
                <p className="mb-6 text-sm leading-7 text-black/80 sm:text-base sm:leading-relaxed">
                  {story.story}
                </p>
                <div className="pt-6 border-t border-stone-300">
                  <p className="text-sm font-semibold text-black/70">
                    💡 <span className="text-black font-bold">{story.insight}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Campaign Types */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
          <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-teal-50 p-6 sm:p-8 lg:p-12">
            <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Campaign Templates
            </h2>
            <p className="mb-8 max-w-2xl text-sm text-black/75 sm:mb-10 sm:text-base">
              Launch structured interventions for any student support scenario. Pre-built templates accelerate deployment while maintaining flexibility.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {campaignTypes.map((example, idx) => (
                <div
                  key={example}
                  className="rounded-lg border border-stone-200 bg-white px-5 py-4 text-center text-sm font-medium text-black hover:border-teal-300 hover:bg-teal-50 transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {example}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="bg-gradient-to-r from-stone-100 via-amber-50 to-stone-200 py-16 text-black sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                Why Educators Choose EduPanel
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {benefits.map((benefit, idx) => (
                <div key={benefit.number} className="flex flex-col gap-4 animate-slide-up sm:flex-row sm:gap-8" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-amber-600 text-lg font-bold text-white">
                      {benefit.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-black sm:text-xl">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-7 text-black/75 sm:text-base sm:leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
          <div className="rounded-2xl bg-gradient-to-r from-amber-100 via-stone-50 to-teal-100 p-6 text-center text-black shadow-lg sm:p-8 md:p-12 lg:p-16">
            <h2 className="mb-6 text-3xl font-bold text-black sm:text-4xl md:text-5xl">
              Transform Student Support
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-black/75 sm:mb-10 sm:text-lg">
              Join educators who are replacing reactive decision-making with data-driven interventions. See the difference structured support makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/features"
                className="rounded-lg bg-amber-200 px-8 py-3.5 text-center font-semibold text-black transition hover:bg-amber-300 shadow-sm"
              >
                Explore Platform
              </Link>
              <Link
                href="/active-campaigns"
                className="rounded-lg border-2 border-stone-400 bg-white px-8 py-3.5 text-center font-semibold text-black transition hover:bg-stone-100"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-stone-50/80 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <p className="max-w-xl text-sm text-black">© 2024 EduPanel. Supporting educators in evidence-based student intervention.</p>
              <Link 
                href="/privacy-policy" 
                className="text-sm text-black/70 hover:text-black transition font-medium"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}