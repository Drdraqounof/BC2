import type { TaskRecord } from "@/app/dashboard-data";

export type TaskApiRecord = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  rubric: string | null;
  attachmentLinks: string | null;
  campaignId: string | null;
  creatorId: string;
  taskAssignments: Array<{
    id: string;
    completedAt: string | null;
    grade?: string | null;
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
};

export function parseAttachmentLinks(rawValue: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function normalizeTaskRecord(task: TaskApiRecord): TaskRecord {
  const completedCount = task.taskAssignments.filter((assignment) => assignment.completedAt !== null).length;
  const studentCount = task.taskAssignments.length;
  const selectedStudentIds = task.taskAssignments.map((assignment) => assignment.student.id);
  const selectedStudents = task.taskAssignments.map((assignment) => {
    return `${assignment.student.firstName} ${assignment.student.lastName}`.trim();
  });
  const attachmentLinks = parseAttachmentLinks(task.attachmentLinks);

  let status: TaskRecord["status"] = "pending";
  if (studentCount > 0 && completedCount === studentCount) {
    status = "completed";
  } else if (completedCount > 0) {
    status = "in-progress";
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    priority: task.priority,
    rubric: task.rubric ?? "",
    attachmentLinks,
    resources: attachmentLinks.map((link, index) => ({
      id: `resource-${task.id}-${index}`,
      title: `Attachment ${index + 1}`,
      url: link,
    })),
    campaignId: task.campaignId ?? undefined,
    creatorId: task.creatorId,
    studentCount,
    completedCount,
    selectedStudents,
    selectedStudentIds,
    comments: [],
    evidence: [],
    ratings: [],
    status,
  };
}