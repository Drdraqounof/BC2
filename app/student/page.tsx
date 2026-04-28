"use client";

import { useState, useEffect } from "react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLabel?: string;
  classroomCode?: string;
};

type Campaign = {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
};

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch("/api/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          if (data.length > 0) {
            setSelectedStudent(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Simulate loading campaigns when student is selected
  useEffect(() => {
    if (selectedStudent) {
      const mockCampaigns: Campaign[] = [
        {
          id: "1",
          title: "Math Intervention Q1",
          description: "Focused math support for Q1 learning objectives",
          status: "active",
          startDate: "2026-01-15",
        },
        {
          id: "2",
          title: "Reading Comprehension",
          description: "Advanced reading strategies and comprehension",
          status: "active",
          startDate: "2026-02-01",
        },
      ];
      setCampaigns(mockCampaigns);
    }
  }, [selectedStudent]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
      {isLoading ? (
        <div className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : students.length === 0 ? (
        <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <p className="text-lg text-[var(--muted)]">No students found. Please add a student first.</p>
        </section>
      ) : (
        <>
          <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Welcome</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Hello, {selectedStudent?.firstName} {selectedStudent?.lastName}
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Here are your assigned campaigns and interventions.
            </p>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4">
              Select Student
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    selectedStudent?.id === student.id
                      ? "bg-[var(--foreground)] text-white"
                      : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--panel-strong)]"
                  }`}
                >
                  {student.firstName} {student.lastName}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
              Campaigns & Interventions
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Your Tasks
            </h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
            {campaigns.length} total
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              No campaigns assigned yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="rounded-[24px] border border-[var(--border)] bg-white p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold tracking-[-0.03em]">
                        {campaign.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-[var(--signal-blue)]/10 text-[var(--signal-blue)]"
                            : "bg-[var(--signal-green)]/10 text-[var(--signal-green)]"
                        }`}
                      >
                        {campaign.status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-3">
                      {campaign.description}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Started: {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--panel)]">
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedStudent && (
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
            Profile
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] mb-6">
            Student Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Name
              </p>
              <p className="text-lg font-semibold">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Grade
              </p>
              <p className="text-lg font-semibold">{selectedStudent.gradeLabel || "—"}</p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Email
              </p>
              <p className="text-lg font-semibold">{selectedStudent.email}</p>
            </div>

            <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">
                Classroom Code
              </p>
              <p className="text-lg font-semibold">
                {selectedStudent.classroomCode || "—"}
              </p>
            </div>
          </div>

          <button className="w-full rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]">
            Edit Profile
          </button>
        </section>
      )}
    </main>
  );
}
