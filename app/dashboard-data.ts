export type CampaignGoalType = "Attendance" | "Grades" | "Behavior" | "Custom";

export type CampaignRecord = {
  id: string;
  title: string;
  description: string;
  students: string;
  selectedStudents: string[];
  selectedStudentIds?: string[];
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

export type TaskType = "Build/Design Project" | "Research" | "Writing" | "Problem Set" | "Other";

export type Resource = {
  id: string;
  title: string;
  url: string;
};

export type Evidence = {
  id: string;
  time: string;
  date: string;
  linkTitle: string;
  url: string;
};

export type Rating = {
  id: string;
  category: string;
  value: number;
  author: string;
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  expirationDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  taskType?: TaskType;
  rubric?: string;
  attachmentLinks?: string[];
  resources?: Resource[];
  evidence?: Evidence[];
  ratings?: Rating[];
  comments?: Comment[];
  campaignId?: string;
  creatorId: string;
  studentCount: number;
  completedCount: number;
  selectedStudents?: string[];
  status: "pending" | "in-progress" | "completed" | "revision-submitted";
};

export const mockTasks: TaskRecord[] = [
  {
    id: "task-1",
    title: "Complete Missing Algebra Worksheet",
    description: "Students need to complete sections 3-5 of the Quadratic Equations worksheet.",
    dueDate: "2026-04-24",
    expirationDate: "2026-04-30",
    priority: "HIGH",
    taskType: "Problem Set",
    rubric: "Full marks for all problems correct. Partial credit for working shown.",
    attachmentLinks: ["https://example.com/worksheet.pdf"],
    resources: [
      { id: "res-1", title: "Quadratic Equations Guide", url: "https://example.com/guide.pdf" },
      { id: "res-2", title: "Practice Problems", url: "https://example.com/practice.pdf" },
    ],
    evidence: [
      { id: "ev-1", time: "14:30", date: "2026-04-24", linkTitle: "Completed worksheet", url: "https://example.com/submitted-1.pdf" },
    ],
    ratings: [
      { id: "rat-1", category: "Accuracy", value: 7, author: "Teacher-1" },
      { id: "rat-2", category: "Completeness", value: 8, author: "Teacher-1" },
    ],
    comments: [
      { id: "com-1", author: "Teacher-1", text: "Good progress! Review section 4 for more practice.", timestamp: "2026-04-24T15:30:00Z" },
    ],
    campaignId: "campaign-missing-work",
    creatorId: "teacher-1",
    studentCount: 3,
    completedCount: 1,
    selectedStudents: ["Maya Thompson", "Ava Patel", "Noah Rivera"],
    status: "in-progress",
  },
  {
    id: "task-2",
    title: "Attendance Check-In Call",
    description: "Call home to check in on attendance patterns and discuss support needs.",
    dueDate: "2026-04-23",
    priority: "HIGH",
    taskType: "Other",
    rubric: "Document call in student file. Note any barriers and next steps.",
    campaignId: "campaign-attendance",
    creatorId: "teacher-1",
    studentCount: 2,
    completedCount: 1,
    selectedStudents: ["Noah Rivera", "Maya Thompson"],
    status: "in-progress",
  },
  {
    id: "task-3",
    title: "Biology Practice Quiz",
    description: "Students complete practice quiz on cell division and photosynthesis.",
    dueDate: "2026-04-22",
    priority: "MEDIUM",
    taskType: "Problem Set",
    attachmentLinks: ["https://example.com/quiz.pdf"],
    resources: [
      { id: "res-3", title: "Study Guide", url: "https://example.com/bio-study.pdf" },
    ],
    campaignId: "campaign-test-prep",
    creatorId: "teacher-1",
    studentCount: 5,
    completedCount: 5,
    selectedStudents: ["Eli Johnson", "Ava Patel"],
    status: "completed",
  },
  {
    id: "task-4",
    title: "Peer Review Assignment",
    description: "Standalone assignment: Students review and provide feedback on peer essays.",
    dueDate: "2026-04-25",
    priority: "MEDIUM",
    taskType: "Writing",
    rubric: "Feedback must include at least one strength and one area for improvement.",
    creatorId: "teacher-1",
    studentCount: 8,
    completedCount: 3,
    selectedStudents: ["Maya Thompson", "Noah Rivera", "Eli Johnson", "Ava Patel"],
    status: "revision-submitted",
  },
];