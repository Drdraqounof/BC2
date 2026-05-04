"use client";

import { useEffect, useState } from "react";
import { activeCampaigns, type TaskRecord } from "@/app/dashboard-data";

type StudentOption = {
  id: string;
  name: string;
};

interface TaskFormProps {
  task?: TaskRecord;
  campaignId?: string;
  onSubmit: (formData: TaskFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  rubric: string;
  attachmentLinks: string;
  campaignId: string;
  selectedStudents: string[];
}

const priorityOptions: Array<"LOW" | "MEDIUM" | "HIGH"> = ["LOW", "MEDIUM", "HIGH"];

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

export function TaskForm({
  task,
  campaignId,
  onSubmit,
  onCancel,
  submitLabel = "Create task",
}: TaskFormProps) {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormData>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    dueDate: task?.dueDate ?? "",
    priority: task?.priority ?? "MEDIUM",
    rubric: task?.rubric ?? "",
    attachmentLinks: task?.attachmentLinks?.join(", ") ?? "",
    campaignId: task?.campaignId ?? campaignId ?? "",
    selectedStudents: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      try {
        setStudentsLoading(true);
        setStudentsError(null);

        const nextStudents = await fetchAllStudentsFromDatabase();

        if (!isMounted) {
          return;
        }

        setStudents(nextStudents);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load students for the task form:", error);
        setStudentsError("Unable to load students right now.");
      } finally {
        if (isMounted) {
          setStudentsLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleFieldChange<K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleStudentSelection(studentName: string) {
    setForm((current) => {
      const isSelected = current.selectedStudents.includes(studentName);
      return {
        ...current,
        selectedStudents: isSelected
          ? current.selectedStudents.filter((name) => name !== studentName)
          : [...current.selectedStudents, studentName],
      };
    });
  }

  function assignToAllStudents() {
    setForm((current) => ({
      ...current,
      selectedStudents: students.map((student) => student.name),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = form.title.trim();

    if (!title) {
      return;
    }

    onSubmit(form);
  }

  return (
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
        Due datee
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
          {activeCampaigns.map((campaign) => (
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

      <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
        Attachment links (comma-separated)
        <input
          value={form.attachmentLinks}
          onChange={(event) => handleFieldChange("attachmentLinks", event.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          placeholder="https://example.com/file.pdf, https://example.com/rubric.pdf"
        />
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
                    checked={form.selectedStudents.includes(student.name)}
                    onChange={() => toggleStudentSelection(student.name)}
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
          className="rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
