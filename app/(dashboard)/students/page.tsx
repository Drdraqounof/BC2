"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLabel?: string;
  password?: string;
  classroomCode?: string | null;
  classroomId?: string | null;
  classroom?: {
    id: string;
    name: string;
    code: string;
    teacherId: string;
  } | null;
};

type Classroom = {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  studentCount: number;
  createdAt?: string;
};

type Assignment = {
  id: string;
  title: string;
  submittedAt: string;
  grade: string;
  status: "submitted" | "pending" | "graded";
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  grade: string;
  classroomId: string;
};

type ClassroomFormState = {
  name: string;
  code: string;
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormClosing, setIsFormClosing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetForm, setResetForm] = useState({
    teacherPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    grade: "",
    classroomId: "",
  });
  const [classroomForm, setClassroomForm] = useState<ClassroomFormState>({
    name: "",
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [classroomError, setClassroomError] = useState("");
  const [classroomSuccess, setClassroomSuccess] = useState("");
  const [isCreatingClassroom, setIsCreatingClassroom] = useState(false);

  const loadStudents = async (options?: { classroomId?: string }) => {
    const searchParams = new URLSearchParams();

    if (options?.classroomId && options.classroomId !== "all") {
      searchParams.set("classroomId", options.classroomId);
    }

    const query = searchParams.toString();
    const response = await fetch(query ? `/api/students?${query}` : "/api/students");

    if (!response.ok) {
      throw new Error(`Failed to fetch students (${response.status})`);
    }

    const data = await response.json();
    setStudents(data);
    setAllStudents(data);
  };

  const loadClassrooms = async (currentTeacherEmail: string) => {
    if (!currentTeacherEmail) {
      setClassrooms([]);
      return;
    }

    const response = await fetch(`/api/classrooms?teacherEmail=${encodeURIComponent(currentTeacherEmail)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch classrooms (${response.status})`);
    }

    const data = await response.json();
    setClassrooms(data);
  };

  // Load students from API on mount
  useEffect(() => {
    const loadStudentDirectory = async () => {
      try {
        const storedTeacherEmail = window.localStorage.getItem("edupanel.teacherEmail")?.trim() || "";
        setTeacherEmail(storedTeacherEmail);

        await Promise.all([
          loadStudents(),
          loadClassrooms(storedTeacherEmail),
        ]);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    };

    loadStudentDirectory();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filtered = allStudents.filter((student) => {
      const matchesSearch =
        normalizedSearch === "" ||
        student.firstName.toLowerCase().includes(normalizedSearch) ||
        student.lastName.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        student.classroom?.name?.toLowerCase().includes(normalizedSearch) ||
        student.classroomCode?.toLowerCase().includes(normalizedSearch);

      const matchesClassroom = classroomFilter === "all" || student.classroomId === classroomFilter;

      return matchesSearch && matchesClassroom;
    });

    setStudents(filtered);
  }, [searchQuery, allStudents, classroomFilter]);

  const handleFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClassroomFieldChange = <K extends keyof ClassroomFormState>(field: K, value: ClassroomFormState[K]) => {
    setClassroomForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeForm = () => {
    setIsFormClosing(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setIsFormClosing(false);
      setError("");
      setSuccessMessage("");
    }, 500);
  };

  const handleCreateClassroom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClassroomError("");
    setClassroomSuccess("");

    if (!teacherEmail) {
      setClassroomError("Sign in as a teacher before creating classrooms.");
      return;
    }

    if (!classroomForm.name.trim()) {
      setClassroomError("Classroom name is required.");
      return;
    }

    setIsCreatingClassroom(true);

    try {
      const response = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail,
          name: classroomForm.name.trim(),
          code: classroomForm.code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create classroom");
      }

      await loadClassrooms(teacherEmail);
      setClassroomSuccess(`Classroom ${data.name} created with code ${data.code}.`);
      setClassroomForm({ name: "", code: "" });
      if (!form.classroomId) {
        setForm((prev) => ({ ...prev, classroomId: data.id }));
      }
    } catch (err) {
      setClassroomError(err instanceof Error ? err.message : "Failed to create classroom");
    } finally {
      setIsCreatingClassroom(false);
    }
  };

  const getMockAssignments = (studentId: string): Assignment[] => {
    // Mock assignments data - in production, fetch from API
    const allAssignments: Record<string, Assignment[]> = {
      "student-1": [
        {
          id: "1",
          title: "Math Quiz Chapter 5",
          submittedAt: "2026-04-25",
          grade: "A",
          status: "graded",
        },
        {
          id: "2",
          title: "Reading Assignment",
          submittedAt: "2026-04-24",
          grade: "B+",
          status: "graded",
        },
      ],
      "student-2": [
        {
          id: "3",
          title: "Science Project",
          submittedAt: "2026-04-23",
          grade: "A-",
          status: "graded",
        },
      ],
    };
    return allAssignments[studentId] || [];
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    setIsDeleteConfirmOpen(false);
    setTimeout(() => {
      setSelectedStudent(null);
      setPasswordConfirmed(false);
      setShowPassword(false);
      setResetError("");
      setResetSuccess("");
      setDeleteError("");
    }, 300);
  };

  const openProfile = (student: Student) => {
    router.push(`/students/${student.id}`);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetLoading(true);

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError("New passwords do not match");
      setResetLoading(false);
      return;
    }

    if (!resetForm.newPassword || resetForm.newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      setResetLoading(false);
      return;
    }

    if (!resetForm.teacherPassword) {
      setResetError("Please enter your password to confirm");
      setResetLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/students/${selectedStudent?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: resetForm.newPassword,
          teacherPassword: resetForm.teacherPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reset password");
      }

      setResetSuccess("Password reset successfully!");
      setResetForm({
        teacherPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setIsResetPasswordOpen(false);
        setResetSuccess("");
      }, 2000);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    
    setDeleteError("");
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/students/${selectedStudent.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete student");
      }

      await Promise.all([
        loadStudents({ classroomId: classroomFilter }),
        loadClassrooms(teacherEmail),
      ]);

      // Close profile modal
      closeProfile();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete student");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Validate form
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          grade: form.grade || null,
          classroomId: form.classroomId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create student");
      }

      await Promise.all([
        loadStudents({ classroomId: classroomFilter }),
        loadClassrooms(teacherEmail),
      ]);

      setSuccessMessage(`Student ${form.firstName} ${form.lastName} added successfully!`);
      setForm({ firstName: "", lastName: "", email: "", password: "", grade: "", classroomId: "" });

      setTimeout(() => {
        closeForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 100vh;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 100vh;
          }
          to {
            opacity: 0;
            max-height: 0;
          }
        }
        
        .form-enter {
          animation: slideDown 0.6s ease-out forwards;
        }
        
        .form-exit {
          animation: slideUp 0.5s ease-in forwards;
        }
      `}</style>
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Students</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Add students and view their intervention status.
        </h1>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Classroom Codes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Manage teacher classrooms</h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
            {classrooms.length} classroom{classrooms.length === 1 ? "" : "s"}
          </span>
        </div>

        {classroomError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50/50 p-4">
            <p className="text-sm text-red-700">{classroomError}</p>
          </div>
        ) : null}

        {classroomSuccess ? (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50/50 p-4">
            <p className="text-sm text-green-700">{classroomSuccess}</p>
          </div>
        ) : null}

        <form className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_auto]" onSubmit={handleCreateClassroom}>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Classroom name
            <input
              type="text"
              value={classroomForm.name}
              onChange={(e) => handleClassroomFieldChange("name", e.target.value)}
              placeholder="Period 2 Algebra"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Classroom code
            <input
              type="text"
              value={classroomForm.code}
              onChange={(e) => handleClassroomFieldChange("code", e.target.value)}
              placeholder="Optional custom code"
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-[var(--signal-blue)]"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isCreatingClassroom}
              className="w-full rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:opacity-50"
            >
              {isCreatingClassroom ? "Creating..." : "Create classroom"}
            </button>
          </div>
        </form>

        {classrooms.length > 0 ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {classrooms.map((classroom) => (
              <article key={classroom.id} className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                <p className="text-lg font-semibold tracking-[-0.03em]">{classroom.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Code: {classroom.code}</p>
                <p className="mt-3 text-sm font-medium text-[var(--foreground)]">{classroom.studentCount} student{classroom.studentCount === 1 ? "" : "s"}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
            <p className="text-sm text-[var(--muted)]">No classrooms created yet. Create one before assigning students.</p>
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Add New Student</p>

        {!isFormOpen && !isFormClosing ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-6 w-full rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
          >
            Add New Student
          </button>
        ) : (
          <div className={isFormClosing ? "form-exit overflow-hidden" : "form-enter overflow-hidden"}>
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-4 animate-in fade-in duration-300">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/50 p-4 animate-in fade-in duration-300">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.1s", animationFillMode: "both"}}>
                First Name
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  placeholder="John"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.15s", animationFillMode: "both"}}>
                Last Name
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  placeholder="Smith"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.2s", animationFillMode: "both"}}>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="john.smith@example.com"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.25s", animationFillMode: "both"}}>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.3s", animationFillMode: "both"}}>
                Grade (Optional)
                <input
                  type="text"
                  value={form.grade}
                  onChange={(e) => handleFieldChange("grade", e.target.value)}
                  placeholder="10th Grade"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)] animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.325s", animationFillMode: "both"}}>
                Classroom
                <select
                  value={form.classroomId}
                  onChange={(e) => handleFieldChange("classroomId", e.target.value)}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                >
                  <option value="">No classroom selected</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} ({classroom.code})
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end gap-3 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: "0.35s", animationFillMode: "both"}}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={() => closeForm()}
                  className="flex-1 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Student Directory</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              All Students
            </h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
            {students.length} of {allStudents.length} students
          </span>
        </div>

        <div className="mb-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Search by name, email, or classroom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            />
            <select
              value={classroomFilter}
              onChange={(e) => setClassroomFilter(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              <option value="all">All classrooms</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-6 text-center">
            <p className="text-sm text-[var(--muted)]">
              {searchQuery ? "No students match your search. Try a different search term." : "No students added yet. Add your first student to get started."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {students.map((student) => (
              <article
                key={student.id}
                className="grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center"
              >
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em]">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{student.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Grade</p>
                  <p className="mt-2 text-sm font-medium">{student.gradeLabel || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Classroom</p>
                  <p className="mt-2 text-sm font-medium">{student.classroom?.name || student.classroomCode || "—"}</p>
                </div>
                <button
                  onClick={() => openProfile(student)}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--panel-strong)]"
                >
                  View Profile
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {isProfileOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl rounded-[34px] border border-white/60 bg-white/98 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.15)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => closeProfile()}
                className="text-2xl text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4">Student Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">First Name</p>
                    <p className="text-lg font-semibold">{selectedStudent.firstName}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">Last Name</p>
                    <p className="text-lg font-semibold">{selectedStudent.lastName}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">Email</p>
                    <p className="text-lg font-semibold">{selectedStudent.email}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">Grade</p>
                    <p className="text-lg font-semibold">{selectedStudent.gradeLabel || "—"}</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4 md:col-span-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-2">Classroom</p>
                    <p className="text-lg font-semibold">
                      {selectedStudent.classroom?.name || "No classroom assigned"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Code: {selectedStudent.classroom?.code || selectedStudent.classroomCode || "—"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4">Password</h3>
                <div className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                  {!passwordConfirmed ? (
                    <div className="space-y-4">
                      <p className="text-sm text-[var(--muted)]">⚠️ Password access is restricted for security. Click the button below to confirm you want to view it.</p>
                      <button
                        onClick={() => setPasswordConfirmed(true)}
                        className="w-full rounded-2xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Reveal Password Hash
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={selectedStudent.password || ""}
                          readOnly
                          className="flex-1 rounded-xl border border-[var(--border)] bg-gray-100 px-3 py-2 text-sm font-mono text-xs break-all"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--panel)]"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <p className="text-xs text-[var(--muted)]">🔒 This is the hashed password stored in the database. It cannot be reversed to view the actual password.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.28em] text-[var(--muted)] mb-4">Submitted Assignments</h3>
                {getMockAssignments(selectedStudent.id).length === 0 ? (
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-4 text-center">
                    <p className="text-sm text-[var(--muted)]">No assignments submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getMockAssignments(selectedStudent.id).map((assignment) => (
                      <div key={assignment.id} className="rounded-[24px] border border-[var(--border)] bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">{assignment.title}</p>
                            <p className="text-sm text-[var(--muted)] mt-1">
                              Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                assignment.status === "graded"
                                  ? "bg-[var(--signal-green)]/10 text-[var(--signal-green)]"
                                  : "bg-[var(--signal-blue)]/10 text-[var(--signal-blue)]"
                              }`}
                            >
                              {assignment.status === "graded" ? "Graded" : "Pending"}
                            </span>
                            <p className="text-lg font-semibold mt-2">{assignment.grade}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => closeProfile()}
                  className="flex-1 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  Close
                </button>
                <button
                  onClick={() => setIsResetPasswordOpen(true)}
                  className="flex-1 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="flex-1 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[34px] border border-white/60 bg-white/98 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.15)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-red-600">Delete Student?</h2>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="text-2xl text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[var(--muted)] mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</span>? This action cannot be undone and will remove them from the system permanently.
            </p>

            {deleteError && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 mb-4">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetPasswordOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[34px] border border-white/60 bg-white/98 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.15)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">Reset Password</h2>
              <button
                onClick={() => setIsResetPasswordOpen(false)}
                className="text-2xl text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[var(--muted)] mb-6">
              Resetting password for: <span className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</span>
            </p>

            {resetError && (
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 mb-4">
                <p className="text-sm text-red-700">{resetError}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4 mb-4">
                <p className="text-sm text-green-700">{resetSuccess}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                <span>Your Password (to confirm)</span>
                <input
                  type="password"
                  value={resetForm.teacherPassword}
                  onChange={(e) => setResetForm({ ...resetForm, teacherPassword: e.target.value })}
                  placeholder="Enter your password"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                <span>New Student Password</span>
                <input
                  type="password"
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordOpen(false)}
                  className="flex-1 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}