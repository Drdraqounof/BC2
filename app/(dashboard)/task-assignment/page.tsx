"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type TaskRecord } from "../../dashboard-data";

type StudentOption = {
  id: string;
  name: string;
};

type TeacherRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type CampaignOption = {
  id: string;
  title: string;
};

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

type AttachmentLink = {
  id: string;
  url: string;
  label: string;
};

type TaskFormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  rubric: string;
  attachmentLinks: AttachmentLink[];
  campaignId: string;
  selectedStudents: string[];
  linkInput: string;
  linkLabelInput: string;
};

function getEmptyTaskForm(): TaskFormState {
  return {
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    rubric: "",
    attachmentLinks: [],
    campaignId: "",
    selectedStudents: [],
    linkInput: "",
    linkLabelInput: "",
  };
}

const priorityOptions: Array<"LOW" | "MEDIUM" | "HIGH"> = ["LOW", "MEDIUM", "HIGH"];
const priorityColors: Record<string, string> = {
  LOW: "bg-[var(--signal-green)]",
  MEDIUM: "bg-[var(--signal-gold)]",
  HIGH: "bg-[var(--signal-red)]",
};

async function fetchAllStudentsFromDatabase(): Promise<StudentOption[]> {
  const response = await fetch("/api/students", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students from the database.");
  }

  const students = (await response.json()) as Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;

  return students.map((student) => {
    const name = `${student.firstName} ${student.lastName}`.trim();

    return {
      id: student.id,
      name: name || student.email,
    };
  });
}

async function fetchTeacherByEmail(email: string): Promise<TeacherRecord> {
  const response = await fetch(`/api/teachers?email=${encodeURIComponent(email)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the signed-in teacher.");
  }

  return (await response.json()) as TeacherRecord;
}

async function fetchTeacherTasks(): Promise<TaskRecord[]> {
  const response = await fetch(`/api/tasks`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks from the database.");
  }

  const tasks = (await response.json()) as TaskApiRecord[];
  return tasks.map(normalizeTaskRecord);
}

async function fetchTeacherCampaigns(ownerId: string): Promise<CampaignOption[]> {
  const response = await fetch(`/api/campaigns?ownerId=${encodeURIComponent(ownerId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campaigns from the database.");
  }

  const campaigns = (await response.json()) as Array<{
    id: string;
    title: string;
  }>;

  return campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
  }));
}

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

export default function TaskAssignmentPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState("");
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [taskSubmitError, setTaskSubmitError] = useState<string | null>(null);
  const [taskSubmitSuccess, setTaskSubmitSuccess] = useState<string | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [form, setForm] = useState<TaskFormState>(getEmptyTaskForm());
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      try {
        setStudentsLoading(true);
        setTasksLoading(true);
        setStudentsError(null);
        setTasksError(null);

        const storedTeacherEmail = window.localStorage.getItem("edupanel.teacherEmail")?.trim();
        const [nextStudents, teacher] = await Promise.all([
          fetchAllStudentsFromDatabase(),
          storedTeacherEmail ? fetchTeacherByEmail(storedTeacherEmail) : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        setStudents(nextStudents);

        if (!teacher) {
          setTeacherId("");
          setCampaigns([]);
          setTasks([]);
          setTasksError("Sign in as a teacher to load and assign tasks.");
          return;
        }

        setTeacherId(teacher.id);
        const [nextTasks, nextCampaigns] = await Promise.all([
          fetchTeacherTasks(),
          fetchTeacherCampaigns(teacher.id),
        ]);

        if (!isMounted) {
          return;
        }

        setTasks(nextTasks);
        setCampaigns(nextCampaigns);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load task assignment workspace:", error);
        setStudentsError("Unable to load students right now.");
        setTasksError("Unable to load tasks right now.");
      } finally {
        if (isMounted) {
          setStudentsLoading(false);
          setTasksLoading(false);
        }
      }
    }

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by student
      if (filterStudentId !== "all") {
        if (!task.selectedStudentIds || !task.selectedStudentIds.includes(filterStudentId)) {
          return false;
        }
      }

      if (filterStatus === "completed" && task.completedCount !== task.studentCount) {
        return false;
      }
      if (filterStatus === "pending" && task.completedCount > 0) {
        return false;
      }

      return true;
    });
  }, [tasks, filterStudentId, filterStatus]);

  function handleFieldChange<K extends keyof TaskFormState>(field: K, value: TaskFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(getEmptyTaskForm());
  }

  function addLink() {
    const url = form.linkInput.trim();
    const label = form.linkLabelInput.trim();

    if (!url) return;

    const newLink: AttachmentLink = {
      id: `link-${crypto.randomUUID()}`,
      url,
      label: label || url,
    };

    handleFieldChange("attachmentLinks", [...form.attachmentLinks, newLink]);
    handleFieldChange("linkInput", "");
    handleFieldChange("linkLabelInput", "");
  }

  function removeLink(linkId: string) {
    handleFieldChange(
      "attachmentLinks",
      form.attachmentLinks.filter((link) => link.id !== linkId)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || form.selectedStudents.length === 0) {
      return;
    }

    if (isCreatingTask) {
      if (!teacherId) {
        setTaskSubmitError("Sign in as a teacher before creating tasks.");
        return;
      }

      setTaskSubmitError(null);
      setTaskSubmitSuccess(null);
      setIsSavingTask(true);

      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            dueDate: form.dueDate || null,
            priority: form.priority,
            rubric: form.rubric.trim() || null,
            attachmentLinks: form.attachmentLinks.map((link) => link.url),
            campaignId: form.campaignId || null,
            creatorId: teacherId,
            studentIds: form.selectedStudents,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create the task.");
        }

        const newTask = normalizeTaskRecord(data as TaskApiRecord);
        setTasks((current) => [newTask, ...current]);
        setTaskSubmitSuccess("Task created and assigned successfully.");
        resetForm();
        setIsCreatingTask(false);
      } catch (error) {
        console.error("Failed to create task:", error);
        setTaskSubmitError(error instanceof Error ? error.message : "Failed to create the task.");
      } finally {
        setIsSavingTask(false);
      }
    }
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function markTaskComplete(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, completedCount: task.studentCount, status: "completed" as const }
          : task,
      ),
    );
  }

  function toggleStudentSelection(studentId: string) {
    setForm((current) => {
      const isSelected = current.selectedStudents.includes(studentId);
      return {
        ...current,
        selectedStudents: isSelected
          ? current.selectedStudents.filter((id) => id !== studentId)
          : [...current.selectedStudents, studentId],
      };
    });
  }

  function assignToAllStudents() {
    setForm((current) => ({
      ...current,
      selectedStudents: students.map((student) => student.id),
    }));
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Task Management</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Create and assign tasks to help students succeed.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Assign work to individual students or groups. Track completion and provide feedback.
        </p>
      </section>

      {taskSubmitSuccess ? (
        <section className="rounded-2xl border border-[var(--signal-green)]/30 bg-[var(--signal-green)]/10 p-4 text-sm text-[var(--signal-green)]">
          {taskSubmitSuccess}
        </section>
      ) : null}

      {taskSubmitError ? (
        <section className="rounded-2xl border border-[var(--signal-red)]/30 bg-[var(--signal-red)]/10 p-4 text-sm text-[var(--signal-red)]">
          {taskSubmitError}
        </section>
      ) : null}

      {tasksError && !isCreatingTask ? (
        <section className="rounded-2xl border border-[var(--signal-red)]/30 bg-[var(--signal-red)]/10 p-4 text-sm text-[var(--signal-red)]">
          {tasksError}
        </section>
      ) : null}

      {/* Create Task Form */}
      {isCreatingTask ? (
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Create Task</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Assign new work to students</h2>
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Task title
              <input
                value={form.title}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                placeholder="e.g., Complete Algebra Worksheet 5-7"
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Description
              <textarea
                value={form.description}
                onChange={(event) => handleFieldChange("description", event.target.value)}
                className="min-h-24 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                placeholder="Describe what students need to do..."
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => handleFieldChange("dueDate", event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Priority
              <select
                value={form.priority}
                onChange={(event) => handleFieldChange("priority", event.target.value as "LOW" | "MEDIUM" | "HIGH")}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Link to campaign (optional)
              <select
                value={form.campaignId}
                onChange={(event) => handleFieldChange("campaignId", event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              >
                <option value="">No campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Rubric or grading criteria
              <textarea
                value={form.rubric}
                onChange={(event) => handleFieldChange("rubric", event.target.value)}
                className="min-h-20 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                placeholder="How will this be graded? What criteria matter?"
              />
            </label>

            {/* Attachment Links Section */}
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Attachment links
              <div className="space-y-3">
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    value={form.linkInput}
                    onChange={(event) => handleFieldChange("linkInput", event.target.value)}
                    className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                    placeholder="https://example.com/file.pdf"
                  />
                  <input
                    value={form.linkLabelInput}
                    onChange={(event) => handleFieldChange("linkLabelInput", event.target.value)}
                    className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                    placeholder="Link label (optional)"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="rounded-2xl bg-[var(--signal-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 whitespace-nowrap"
                  >
                    Add link
                  </button>
                </div>

                {form.attachmentLinks.length > 0 && (
                  <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-white p-3">
                    {form.attachmentLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between gap-2 p-2 bg-[var(--panel)] rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--foreground)] truncate">{link.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--signal-blue)] truncate hover:underline"
                          >
                            {link.url}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLink(link.id)}
                          className="flex-shrink-0 rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Assign to students
              <button
                type="button"
                onClick={assignToAllStudents}
                disabled={studentsLoading || students.length === 0}
                className="rounded-2xl border border-[var(--signal-blue)] px-4 py-2 text-sm font-medium text-[var(--signal-blue)] transition hover:bg-[var(--signal-blue)]/10"
              >
                Assign to all students
              </button>
              <div className="grid max-h-48 gap-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-white p-4">
                {studentsLoading ? <span className="text-sm text-[var(--muted)]">Loading students...</span> : null}
                {!studentsLoading && studentsError ? (
                  <span className="text-sm text-[var(--signal-red)]">{studentsError}</span>
                ) : null}
                {!studentsLoading && !studentsError && students.length === 0 ? (
                  <span className="text-sm text-[var(--muted)]">No students found in the database.</span>
                ) : null}
                {!studentsLoading && !studentsError
                  ? students.map((student) => (
                      <label key={student.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{student.name}</span>
                      </label>
                    ))
                  : null}
              </div>
              <span className="text-xs text-[var(--muted)]">{form.selectedStudents.length} selected</span>
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSavingTask}
                className="rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
              >
                {isSavingTask ? "Saving..." : "Create task"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingTask(false);
                  resetForm();
                }}
                className="rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Quick actions</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Manage your tasks</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingTask(true)}
              className="rounded-2xl bg-[var(--signal-blue)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:opacity-90"
            >
              Create new task
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Filter by student
              <select
                value={filterStudentId}
                onChange={(event) => setFilterStudentId(event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              >
                <option key="all" value="all">All students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              Filter by status
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value as "all" | "pending" | "completed")}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              >
                <option value="all">All tasks</option>
                <option value="pending">Pending (in progress)</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
        </section>
      )}

      {/* Task List */}
      {!isCreatingTask && (
        <section className="space-y-4">
          {tasksLoading ? (
            <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-8 text-center">
              <p className="text-sm text-[var(--muted)]">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-8 text-center">
              <p className="text-sm text-[var(--muted)]">No tasks found</p>
              <button
                type="button"
                onClick={() => setIsCreatingTask(true)}
                className="mt-4 rounded-full bg-[var(--signal-blue)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Create your first task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Link key={task.id} href={`/task-assignment/${task.id}`}>
                <article className="cursor-pointer rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:border-[var(--signal-blue)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">{task.title}</h3>
                      <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.campaignId && (
                        <span className="rounded px-2 py-1 text-xs font-medium text-[var(--foreground)] bg-white">
                          {campaigns.find((campaign) => campaign.id === task.campaignId)?.title}
                        </span>
                      )}
                    </div>
                    {task.description && <p className="mt-2 text-sm text-[var(--muted)]">{task.description}</p>}
                    <div className="mt-3 flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {task.completedCount} of {task.studentCount} submitted
                        </span>
                        {task.dueDate && (
                          <span className="text-sm text-[var(--muted)]">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--signal-green)] transition-all"
                          style={{ width: `${(task.completedCount / task.studentCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markTaskComplete(task.id);
                      }}
                      className="rounded-full border border-[var(--signal-green)] px-3 py-1 text-xs font-medium text-[var(--signal-green)] transition hover:bg-[var(--signal-green)]/10"
                    >
                      Mark done
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="rounded-full border border-[var(--signal-red)] px-3 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            </Link>
            ))
          )}
        </section>
      )}
    </main>
  );
}