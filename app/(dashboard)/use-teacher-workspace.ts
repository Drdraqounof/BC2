import { useEffect, useState } from "react";

export interface TeacherWorkspaceData {
  teacher: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    schoolName?: string | null;
    school?: {
      name: string;
    } | null;
  } | null;
  stats: {
    activeCampaigns: number;
    totalStudents: number;
    tasksAssigned: number;
    classrooms: number;
  };
  isLoading: boolean;
  loadError: string | null;
}

export function useTeacherWorkspace(): TeacherWorkspaceData {
  const [teacher, setTeacher] = useState<TeacherWorkspaceData["teacher"]>(null);
  const [stats, setStats] = useState<TeacherWorkspaceData["stats"]>({
    activeCampaigns: 0,
    totalStudents: 0,
    tasksAssigned: 0,
    classrooms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherEmail = localStorage.getItem("edupanel.teacherEmail");
        if (!teacherEmail) {
          setLoadError("No teacher email found in session");
          setIsLoading(false);
          return;
        }

        // Fetch teacher profile
        const teacherResponse = await fetch(
          `/api/teachers?email=${encodeURIComponent(teacherEmail)}`
        );
        if (!teacherResponse.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        const teacherData = await teacherResponse.json();
        setTeacher(teacherData);

        // Calculate stats
        const campaignsResponse = await fetch(`/api/campaigns`);
        const campaignsData = await campaignsResponse.json();
        const campaigns = Array.isArray(campaignsData)
          ? campaignsData
          : campaignsData.campaigns || [];
        const teacherCampaigns = campaigns.filter(
          (c: { ownerId: string }) => c.ownerId === teacherData.id
        );
        const activeCampaigns = teacherCampaigns.filter(
          (c: { status: string }) => c.status === "IN_PROGRESS"
        ).length;

        // Get students assigned to teacher's campaigns
        const studentSet = new Set<string>();
        for (const campaign of teacherCampaigns) {
          // You might need to fetch campaign students from an endpoint
          // For now, we'll count them from the campaign data
        }

        // Get tasks assigned by this teacher
        const tasksResponse = await fetch(`/api/tasks`);
        const tasksData = await tasksResponse.json();
        const allTasks = Array.isArray(tasksData)
          ? tasksData
          : tasksData.tasks || [];
        const teacherTasks = allTasks.filter(
          (t: { creatorId: string }) => t.creatorId === teacherData.id
        );

        // Get classrooms
        const classroomsResponse = await fetch(`/api/classrooms`);
        const classroomsData = await classroomsResponse.json();
        const allClassrooms = Array.isArray(classroomsData)
          ? classroomsData
          : classroomsData.classrooms || [];
        const teacherClassrooms = allClassrooms.filter(
          (c: { teacherId: string }) => c.teacherId === teacherData.id
        );

        setStats({
          activeCampaigns,
          totalStudents: studentSet.size,
          tasksAssigned: teacherTasks.length,
          classrooms: teacherClassrooms.length,
        });
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  return { teacher, stats, isLoading, loadError };
}
