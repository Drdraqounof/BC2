"use client";

import { useEffect, useState } from "react";

import { activeCampaigns, type CampaignRecord, type TaskRecord } from "../dashboard-data";

type TaskApiRecord = {
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
    student: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
};

export type StudentWorkspaceStudent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLabel?: string;
  classroomCode?: string;
};

type UseStudentWorkspaceResult = {
  student: StudentWorkspaceStudent | null;
  tasks: TaskRecord[];
  campaigns: CampaignRecord[];
  isLoading: boolean;
  loadError: string;
};

function parseAttachmentLinks(rawValue: string | null): string[] {
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

function normalizeTaskRecord(task: TaskApiRecord): TaskRecord {
  const completedCount = task.taskAssignments.filter((assignment) => assignment.completedAt !== null).length;
  const studentCount = task.taskAssignments.length;
  const selectedStudentIds = task.taskAssignments.map((assignment) => assignment.student.id);
  const selectedStudents = task.taskAssignments.map((assignment) => {
    return `${assignment.student.firstName} ${assignment.student.lastName}`.trim();
  });

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
    attachmentLinks: parseAttachmentLinks(task.attachmentLinks),
    campaignId: task.campaignId ?? undefined,
    creatorId: task.creatorId,
    studentCount,
    completedCount,
    selectedStudents,
    selectedStudentIds,
    comments: [],
    evidence: [],
    ratings: [],
    resources: [],
    status,
  };
}

async function fetchAssignedTasks(studentId: string): Promise<TaskRecord[]> {
  const response = await fetch(`/api/tasks?studentId=${encodeURIComponent(studentId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load your assigned tasks.");
  }

  const tasks = (await response.json()) as TaskApiRecord[];
  return tasks.map(normalizeTaskRecord);
}

export function useStudentWorkspace(): UseStudentWorkspaceResult {
  const [student, setStudent] = useState<StudentWorkspaceStudent | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const storedEmail = window.localStorage.getItem("edupanel.studentEmail")?.trim();

        if (!storedEmail) {
          setLoadError("No student session found. Please sign in again.");
          return;
        }

        const response = await fetch(`/api/students?email=${encodeURIComponent(storedEmail)}`);

        if (!response.ok) {
          setLoadError("Failed to load your student profile.");
          return;
        }

        const data: StudentWorkspaceStudent[] = await response.json();
        const matchedStudent = data[0];

        if (!matchedStudent) {
          setLoadError("We could not find a student account for this sign-in.");
          return;
        }

        const assignedTasks = await fetchAssignedTasks(matchedStudent.id);
        const assignedCampaigns = activeCampaigns.filter((campaign) =>
          assignedTasks.some((task) => task.campaignId === campaign.id)
        );

        setStudent(matchedStudent);
        setTasks(assignedTasks);
        setCampaigns(assignedCampaigns);
        setLoadError("");
      } catch (error) {
        console.error("Failed to load student workspace:", error);
        setLoadError("Failed to load your student profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudent();
  }, []);

  return { student, tasks, campaigns, isLoading, loadError };
}