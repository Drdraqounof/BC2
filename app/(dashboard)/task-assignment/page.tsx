"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { mockTasks, studentList, activeCampaigns, type TaskRecord } from "../../dashboard-data";

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

export default function TaskAssignmentPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>(mockTasks);
  const [form, setForm] = useState<TaskFormState>(getEmptyTaskForm());
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by student
      if (filterStudentId !== "all") {
        if (!task.selectedStudents || !task.selectedStudents.includes(filterStudentId)) {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || form.selectedStudents.length === 0) {
      return;
    }

    if (isCreatingTask) {
      const newTask: TaskRecord = {
        id: `task-${crypto.randomUUID()}`,
        title,
        description,
        dueDate: form.dueDate,
        priority: form.priority,
        rubric: form.rubric,
        attachmentLinks: form.attachmentLinks.map(link => link.url),
        campaignId: form.campaignId || undefined,
        creatorId: "teacher-1",
        studentCount: form.selectedStudents.length,
        completedCount: 0,
        status: "pending",
      };

      setTasks((current) => [newTask, ...current]);
      resetForm();
      setIsCreatingTask(false);
    }
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
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
      selectedStudents: studentList.map((student) => student.name),
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
                className="rounded-2xl border border-[var(--signal-blue)] px-4 py-2 text-sm font-medium text-[var(--signal-blue)] transition hover:bg-[var(--signal-blue)]/10"
              >
                Assign to all students
              </button>
              <div className="grid max-h-48 gap-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-white p-4">
                {studentList.map((student) => (
                  <label key={student.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.selectedStudents.includes(student.name)}
                      onChange={() => toggleStudentSelection(student.name)}
                      className="rounded"
                    />
                    <span className="text-sm">{student.name}</span>
                  </label>
                ))}
              </div>
              <span className="text-xs text-[var(--muted)]">{form.selectedStudents.length} selected</span>
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
              >
                Create task
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
                {studentList.map((student) => (
                  <option key={student.name} value={student.name}>
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
          {filteredTasks.length === 0 ? (
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
                          {activeCampaigns.find((c) => c.id === task.campaignId)?.title}
                        </span>
                      )}
                    </div>
                    {task.description && <p className="mt-2 text-sm text-[var(--muted)]">{task.description}</p>}
                    <div className="mt-3 flex items-center gap-4">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {task.completedCount} of {task.studentCount} completed
                      </span>
                      {task.dueDate && (
                        <span className="text-sm text-[var(--muted)]">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
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