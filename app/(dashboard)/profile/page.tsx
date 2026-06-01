"use client";

import { useTeacherWorkspace } from "../../use-teacher-workspace";
import { useState } from "react";

export default function TeacherProfilePage() {
  const { teacher, stats, isLoading, loadError } = useTeacherWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Initialize form when teacher data loads
  if (teacher && formData.firstName === "") {
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      school: teacher.schoolName || teacher.school?.name || "",
    });
  }

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: teacher?.firstName || "",
      lastName: teacher?.lastName || "",
      email: teacher?.email || "",
      school: teacher?.school?.name || "",
    });
    setSaveError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!teacher?.id) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch(`/api/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          school: formData.school,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
      // Optionally: refresh the page or re-fetch teacher data
      window.location.reload();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      {isLoading ? (
        <div className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : !teacher ? (
        <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-lg text-[var(--muted)]">
            {loadError || "No teacher profile is available for this account."}
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Teacher Profile</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Manage your account details and view workspace statistics.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Account</p>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-2 w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-2 w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      School
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      className="mt-2 w-full bg-transparent text-lg font-semibold outline-none"
                    />
                  </div>

                  {saveError && (
                    <div className="rounded-[24px] border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-600">{saveError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 rounded-[24px] bg-[var(--accent-blue)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-[var(--accent-blue)]/90 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 rounded-[24px] border border-[var(--border)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] hover:bg-white/50 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Name</p>
                    <p className="mt-2 text-lg font-semibold">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Email</p>
                    <p className="mt-2 text-lg font-semibold">{teacher.email}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">School</p>
                    <p className="mt-2 text-lg font-semibold">
                      {teacher.schoolName || teacher.school?.name || "—"}
                    </p>
                  </div>
                </div>
              )}
            </article>

            <article className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Workspace Stats</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Active Campaigns</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {stats.activeCampaigns}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Total Students</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {stats.totalStudents}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Tasks Assigned</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {stats.tasksAssigned}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Classrooms</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {stats.classrooms}
                  </p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
