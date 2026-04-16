export type CampaignGoalType = "Attendance" | "Grades" | "Behavior" | "Custom";

export type CampaignRecord = {
  id: string;
  title: string;
  description: string;
  students: string;
  selectedStudents: string[];
  goal: string;
  goalType: CampaignGoalType;
  status: "Draft" | "In Progress" | "Needs Follow-Up" | "On Track" | "Completed";
  progress: number;
  accent: string;
  archived: boolean;
};

export const activeCampaigns: CampaignRecord[] = [
  {
    id: "campaign-missing-work",
    title: "Missing Assignments Recovery",
    description: "Recover incomplete work before the next grade checkpoint.",
    students: "8 students",
    selectedStudents: ["Maya Thompson", "Ava Patel", "Noah Rivera"],
    goal: "Reduce missing work to 2 by Friday",
    goalType: "Grades",
    status: "In Progress",
    progress: 72,
    accent: "bg-[var(--signal-red)]",
    archived: false,
  },
  {
    id: "campaign-attendance",
    title: "Attendance Improvement",
    description: "Support daily attendance with family outreach and check-ins.",
    students: "6 students",
    selectedStudents: ["Noah Rivera", "Maya Thompson"],
    goal: "Raise weekly attendance to 95%",
    goalType: "Attendance",
    status: "Needs Follow-Up",
    progress: 58,
    accent: "bg-[var(--signal-gold)]",
    archived: false,
  },
  {
    id: "campaign-test-prep",
    title: "Test Preparation Initiative",
    description: "Build readiness before assessment week for the current cohort.",
    students: "13 students",
    selectedStudents: ["Eli Johnson", "Ava Patel"],
    goal: "Lift benchmark readiness before assessment week",
    goalType: "Custom",
    status: "On Track",
    progress: 84,
    accent: "bg-[var(--signal-green)]",
    archived: false,
  },
];

export type StudentRecord = {
  name: string;
  grade: string;
  signal: string;
  status: string;
};

export const studentList: StudentRecord[] = [
  { name: "Maya Thompson", grade: "Algebra 2", signal: "Missing work", status: "Needs reminder" },
  { name: "Noah Rivera", grade: "Advisory", signal: "Attendance", status: "Family outreach" },
  { name: "Eli Johnson", grade: "Biology", signal: "Assessment risk", status: "Intervention added" },
  { name: "Ava Patel", grade: "English 10", signal: "Missing work", status: "Improving" },
];

export const progressMetrics = [
  { label: "Missing work resolved", value: "34%", note: "Last 30 days" },
  { label: "Attendance improvement", value: "18%", note: "Target students" },
  { label: "Benchmark readiness", value: "82%", note: "Current campaign cohort" },
];

export const progressTrends = [
  { label: "Missing Work", values: [88, 73, 58, 45] },
  { label: "Attendance", values: [61, 67, 74, 81] },
  { label: "Quiz Readiness", values: [49, 57, 65, 74] },
];

export const writerPrompts = [
  "Write a family outreach email for students with missing assignments.",
  "Draft a student check-in script for attendance improvement.",
  "Summarize this week's campaign progress for an instructional coach.",
];

export const featureSections = [
  {
    title: "Action-Oriented Campaigns",
    summary:
      "Campaigns package a classroom problem, a teacher action, and a measurable goal into one place.",
    points: [
      "Launch interventions for attendance, missing work, grades, and engagement.",
      "Attach a student group and timeframe to each campaign.",
      "Keep next actions visible with status and progress signals.",
    ],
  },
  {
    title: "Student Visibility",
    summary:
      "Teachers can immediately see which students need support and why they were flagged.",
    points: [
      "Review signals by student instead of searching across tools.",
      "Track outreach and intervention status in context.",
      "Reduce missed follow-up on at-risk students.",
    ],
  },
  {
    title: "Progress Tracking",
    summary:
      "Every intervention should show whether outcomes are moving in the right direction.",
    points: [
      "Compare trend movement across multiple weeks.",
      "Measure attendance, readiness, and completion changes.",
      "Use results to adjust support before issues compound.",
    ],
  },
  {
    title: "AI Writer",
    summary:
      "Communication tools stay connected to the classroom problem instead of producing generic messages.",
    points: [
      "Draft family outreach tied to real campaign goals.",
      "Generate teacher summaries and coaching updates.",
      "Speed up routine writing without losing context.",
    ],
  },
];

export const featurePrinciples = [
  "Clarity over complexity so teachers can act within seconds.",
  "Contextual data that explains why a signal matters.",
  "Goal-based workflows that move from observation to intervention.",
];