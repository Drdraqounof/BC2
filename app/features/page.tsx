import Link from "next/link";

const featurePrinciples = [
  "Actionable, not overwhelming",
  "Goal-driven, not data-driven",
  "Measurable outcomes over observation",
];

const featureSections = [
  {
    title: "Active Campaigns",
    summary: "See every current intervention at a glance with clear goals, student groups, and real-time status.",
    icon: "📋",
    points: [
      "One-screen view of all active support plans",
      "Campaign goal, student count, and progress visible instantly",
      "Color-coded status: On track, At risk, Completed",
      "Filter by issue type, teacher, or time frame",
      "Quick-launch new campaigns from this view",
    ],
  },
  {
    title: "Actionable Insights",
    summary: "Stop staring at dashboards. EduPanel highlights what needs attention and what to do about it.",
    icon: "🎯",
    points: [
      "Missing work patterns surface automatically",
      "Attendance drops flagged before they compound",
      "At-risk students identified by multiple signals",
      "Insight includes next steps (not just alerts)",
      "Context shows why each signal matters",
    ],
  },
  {
    title: "Create Campaigns",
    summary: "Launch support plans in 3 steps: pick the issue, define the goal, select students, set a timeframe.",
    icon: "🚀",
    points: [
      "Issue templates for common interventions",
      "Measurable goals keep campaigns focused",
      "Quick student selection (manual or by signal)",
      "Realistic timelines help track progress",
      "Campaign created and live in under 2 minutes",
    ],
  },
  {
    title: "Progress Tracking",
    summary: "Measure whether interventions are actually working with trend views and outcome metrics.",
    icon: "📊",
    points: [
      "Completion trends for work turnaround",
      "Attendance improvement over campaign duration",
      "Readiness indicators for test prep or skill-building",
      "Before/after snapshots for comparison",
      "Export data for admin reporting or parent meetings",
    ],
  },
  {
    title: "Student Visibility",
    summary: "Know who needs support, their current status, and what action has already been taken.",
    icon: "👥",
    points: [
      "Individual student signal dashboard",
      "Campaign history for each student",
      "Follow-up notes and communication log",
      "Progress within current interventions",
      "At-risk flag if multiple campaigns needed",
    ],
  },
  {
    title: "AI Writer",
    summary: "Draft outreach messages, check-in notes, and summaries without losing classroom context.",
    icon: "✍️",
    points: [
      "Generate parent outreach emails in seconds",
      "Draft check-in messages with student-specific context",
      "Summarize campaign progress for admin reports",
      "Edit suggestions before sending",
      "Keeps tone warm, not robotic",
    ],
  },
];

const workflow = [
  {
    step: "1",
    title: "Spot a Signal",
    description: "Missing work, attendance drop, or at-risk pattern surfaces in EduPanel.",
    color: "bg-blue-500",
  },
  {
    step: "2",
    title: "Launch a Campaign",
    description: "Define the goal, pick students, set timeline. Takes 2–3 minutes.",
    color: "bg-purple-500",
  },
  {
    step: "3",
    title: "Take Action",
    description: "Reach out to students/families using AI-drafted templates with context.",
    color: "bg-pink-500",
  },
  {
    step: "4",
    title: "Track Progress",
    description: "Monitor trends. Adjust if needed. Celebrate wins when students improve.",
    color: "bg-green-500",
  },
];

const outcomes = [
  {
    title: "Priority becomes clear",
    description: "No more guessing which issue deserves your attention first. EduPanel tells you.",
  },
  {
    title: "Interventions have structure",
    description: "Goals + student groups + timelines = measurable, professional, repeatable support.",
  },
  {
    title: "Results are visible",
    description: "Track whether your work is moving the needle. Celebrate progress. Adjust what's not working.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 backdrop-blur-md bg-white/70 border-b border-slate-200/50 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="font-semibold text-slate-900">EduPanel</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900 transition">Home</Link>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
              The Feature Set
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              From insight to action in minutes.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
              EduPanel gives teachers a structured system for identifying problems, launching interventions, and tracking whether student outcomes improve. Six capabilities. One purpose: help you move from observation to measurable action.
            </p>
          </div>
        </section>

        {/* Design Principles */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Built on Three Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featurePrinciples.map((principle) => (
              <div
                key={principle}
                className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 border border-slate-700 hover:border-blue-400 transition"
              >
                <div className="text-4xl mb-4">💡</div>
                <p className="text-lg font-semibold">{principle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The EduPanel Workflow</h2>
              <p className="text-xl text-slate-300">
                Four steps from signal to measurable outcome.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {workflow.map((item, idx) => (
                <div key={item.step} className="relative">
                  <div className={`${item.color} rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl text-white mb-4 mx-auto`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-3">{item.title}</h3>
                  <p className="text-slate-300 text-center text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {idx < workflow.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-3 w-6 text-slate-400">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Six Capabilities</h2>
            <p className="text-xl text-slate-600">
              Everything a teacher needs to turn observations into interventions.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {featureSections.map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{section.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
                      Feature
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900">
                      {section.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  {section.summary}
                </p>
                <ul className="space-y-3">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                What This Means for You
              </h2>
              <p className="text-xl text-slate-600">
                Three outcomes that change how you teach.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {outcomes.map((outcome) => (
                <div
                  key={outcome.title}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {outcome.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to see these features in action?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Log in to the workspace and explore how EduPanel helps you move from data to action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/active-campaigns"
                className="cursor-pointer rounded-lg bg-white px-8 py-4 text-center font-bold text-blue-600 transition hover:bg-blue-50"
              >
                Explore Workspace
              </Link>
              <Link
                href="/"
                className="cursor-pointer rounded-lg border-2 border-white bg-white/20 px-8 py-4 text-center font-bold text-white transition hover:bg-white/30"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center text-slate-600 text-sm">
            <p>EduPanel • Helping teachers move from insight to action</p>
          </div>
        </footer>
      </div>
    </main>
  );
}