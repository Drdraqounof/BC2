"use client";

import { useEffect, useState } from "react";

import { activeCampaigns, mockTasks, type CampaignRecord, type TaskRecord } from "../dashboard-data";

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

        const fullName = `${matchedStudent.firstName} ${matchedStudent.lastName}`;
        const assignedTasks = mockTasks
          .filter((task) => task.selectedStudents?.includes(fullName))
          .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime());
        const assignedCampaigns = activeCampaigns.filter((campaign) =>
          campaign.selectedStudents.includes(fullName)
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