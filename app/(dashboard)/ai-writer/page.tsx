"use client";

import { useState, useEffect } from "react";
import { writerPrompts } from "../../dashboard-data";

type Campaign = {
  id: string;
  title: string;
  description: string;
  goal: string;
  selectedStudents: string[];
};

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  campaignId?: string;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLabel?: string | null;
  classroomCode?: string | null;
};

type TeacherProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  schoolName?: string | null;
};

type EmailType = 
  | "campaign_launch" 
  | "assignment_notification" 
  | "assignment_reminder" 
  | "follow_up_question" 
  | "individual_feedback"
  | "custom";

const emailTypeLabels: Record<EmailType, string> = {
  campaign_launch: "New Campaign Notification",
  assignment_notification: "Assignment Notification",
  assignment_reminder: "Assignment Reminder",
  follow_up_question: "Follow-up Question",
  individual_feedback: "Individual Feedback",
  custom: "Custom Prompt",
};

export default function AiWriterPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [emailType, setEmailType] = useState<EmailType>("campaign_launch");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingStudent, setSendingStudent] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Load campaigns and tasks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch real students from API
        const studentsResponse = await fetch("/api/students");
        if (studentsResponse.ok) {
          const studentData = await studentsResponse.json();
          setAllStudents(studentData);
        }

        // For now, use mock data from dashboard
        // In production, fetch from APIs
        const mockCampaigns: Campaign[] = [
          {
            id: "campaign-1",
            title: "Missing Assignments Recovery",
            description: "Recover incomplete work before the next grade checkpoint.",
            goal: "Reduce missing work to 2 by Friday",
            selectedStudents: ["Maya Thompson", "Ava Patel", "Noah Rivera"],
          },
          {
            id: "campaign-2",
            title: "Attendance Improvement",
            description: "Support daily attendance with family outreach and check-ins.",
            goal: "Raise weekly attendance to 95%",
            selectedStudents: ["Noah Rivera", "Maya Thompson"],
          },
        ];
        setCampaigns(mockCampaigns);

        const storedTeacherEmail = localStorage.getItem("edupanel.teacherEmail")?.trim();
        const teacherResponse = await fetch(
          storedTeacherEmail
            ? `/api/teachers?email=${encodeURIComponent(storedTeacherEmail)}`
            : "/api/teachers"
        );

        if (teacherResponse.ok) {
          const teacherData = await teacherResponse.json();
          const resolvedTeacher = Array.isArray(teacherData) ? teacherData[0] : teacherData;
          setTeacherProfile(resolvedTeacher ?? null);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadData();
  }, []);

  const getSelectedCampaign = () => {
    return campaigns.find((c) => c.id === selectedCampaignId);
  };

  const getSelectedTask = () => {
    return tasks.find((t) => t.id === selectedTaskId);
  };

  const getStudentInfo = (studentName: string): Student | undefined => {
    return allStudents.find(s => `${s.firstName} ${s.lastName}` === studentName);
  };

  const getAllAvailableStudents = () => {
    // Show all students from database, not just campaign students
    return allStudents;
  };

  const teacherDisplayName = teacherProfile
    ? `${teacherProfile.firstName} ${teacherProfile.lastName}`
    : "Your teacher";

  const toggleStudentSelection = (studentName: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentName)) {
        newSet.delete(studentName);
      } else {
        newSet.add(studentName);
      }
      return newSet;
    });
  };

  const toggleAllStudents = () => {
    if (selectedStudents.size === allStudents.length) {
      // All selected, clear all
      setSelectedStudents(new Set());
    } else {
      // Not all selected, select all
      const allStudentNames = allStudents.map(s => `${s.firstName} ${s.lastName}`);
      setSelectedStudents(new Set(allStudentNames));
    }
  };

  const buildContext = () => {
    let context = "";

    if (selectedCampaignId) {
      const campaign = getSelectedCampaign();
      if (campaign) {
        context += `Campaign: ${campaign.title}\n`;
        context += `Description: ${campaign.description}\n`;
        context += `Goal: ${campaign.goal}\n`;
        context += `Students: ${campaign.selectedStudents.join(", ")}\n`;
      }
    }

    if (selectedTaskId) {
      const task = getSelectedTask();
      if (task) {
        context += `\nAssignment: ${task.title}\n`;
        if (task.description) context += `Details: ${task.description}\n`;
        if (task.dueDate) context += `Due Date: ${task.dueDate}\n`;
      }
    }

    return context;
  };

  const buildEmailInstruction = (studentName: string) => {
    switch (emailType) {
      case "campaign_launch":
        return `Write a concise, friendly email to ${studentName} introducing this new campaign and explaining how it will help them.`;
      case "assignment_notification":
        return `Write a brief email to ${studentName} notifying them about a new assignment and what they need to do.`;
      case "assignment_reminder":
        return `Write a friendly reminder email to ${studentName} about an upcoming assignment deadline.`;
      case "follow_up_question":
        return `Write a thoughtful follow-up email to ${studentName} asking about their progress and offering support.`;
      case "individual_feedback":
        return `Write personalized feedback email to ${studentName} on their current work and progress.`;
      case "custom":
        return customPrompt;
    }
  };

  const buildEmailSystemPrompt = () => {
    const rules = [
      "You are an assistant that writes teacher-to-student outreach emails.",
      "Keep the tone professional, warm, direct, and specific to the student context provided.",
      "Keep each email under 150 words.",
      `Sign the email as ${teacherDisplayName}.`,
      "Do not use placeholder text such as [Your School], [Contact Information], [Teacher Name], or any bracketed fill-in fields.",
      "If school or contact details are not explicitly provided, omit them instead of inventing them.",
      "Return only the finished email body with no prefatory notes or explanation.",
    ];

    if (teacherProfile?.schoolName) {
      rules.splice(4, 0, `Use ${teacherProfile.schoolName} as the school name when it is relevant to the email.`);
    }

    return rules.join(" ");
  };

  const buildEmailUserPrompt = (studentName: string): string => {
    const context = buildContext();
    const studentInfo = getStudentInfo(studentName);
    
    let studentContext = `\nStudent: ${studentName}`;
    if (studentInfo?.gradeLabel) {
      studentContext += `\nGrade Level: ${studentInfo.gradeLabel}`;
    }
    if (studentInfo?.email) {
      studentContext += `\nEmail: ${studentInfo.email}`;
    }

    let teacherContext = `\nTeacher Name: ${teacherDisplayName}`;
    if (teacherProfile?.schoolName) {
      teacherContext += `\nSchool: ${teacherProfile.schoolName}`;
    }

    return `${context}${studentContext}${teacherContext}\n\nTask: ${buildEmailInstruction(studentName)}`;
  };

  const handleGenerateEmails = async () => {
    if (!selectedCampaignId && !selectedTaskId) {
      setError("Please select a campaign or assignment");
      return;
    }

    if (selectedStudents.size === 0) {
      setError("Please select at least one student");
      return;
    }

    if (emailType === "custom" && !customPrompt.trim()) {
      setError("Please enter a custom prompt");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setGeneratedEmails({});

    try {
      const emailsData: Record<string, string> = {};
      const systemPrompt = buildEmailSystemPrompt();

      // Generate email for each selected student
      for (const studentName of Array.from(selectedStudents)) {
        const prompt = buildEmailUserPrompt(studentName);

        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, systemPrompt }),
        });

        if (!response.ok) {
          let errorMessage = "Failed to generate email";

          try {
            const errorData = await response.json();
            if (typeof errorData?.error === "string" && errorData.error.trim()) {
              errorMessage = errorData.error;
            }
          } catch {
            // Fall back to the default message if the response body is not JSON.
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        emailsData[studentName] = data.content;
      }

      setGeneratedEmails(emailsData);
      setPreviewModalOpen(true);
      setCurrentPreviewIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate emails");
      console.error("Error generating emails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const studentList = Array.from(selectedStudents);
  const currentStudent = studentList[currentPreviewIndex];
  const currentEmail = currentStudent ? generatedEmails[currentStudent] : "";

  const handleNextEmail = () => {
    if (currentPreviewIndex < studentList.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    }
  };

  const handlePrevEmail = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };

  const handleCopyEmail = (studentName: string) => {
    if (generatedEmails[studentName]) {
      navigator.clipboard.writeText(generatedEmails[studentName]);
      setSuccessMessage(`Copied the draft body for ${studentName}.`);
      setError("");
    }
  };

  const handleEmailDraftChange = (studentName: string, value: string) => {
    setGeneratedEmails((prev) => ({
      ...prev,
      [studentName]: value,
    }));
  };

  const getEmailSubject = (studentName: string) => {
    const campaign = getSelectedCampaign();
    const task = getSelectedTask();

    switch (emailType) {
      case "campaign_launch":
        return campaign ? `${campaign.title}: support plan for ${studentName}` : `Support plan for ${studentName}`;
      case "assignment_notification":
        return task ? `New assignment: ${task.title}` : `New assignment for ${studentName}`;
      case "assignment_reminder":
        return task ? `Reminder: ${task.title}` : `Assignment reminder for ${studentName}`;
      case "follow_up_question":
        return `Checking in on your progress, ${studentName}`;
      case "individual_feedback":
        return `Feedback on your recent work, ${studentName}`;
      case "custom":
        return campaign?.title || task?.title || `Message for ${studentName}`;
    }
  };

  const handleSendEmail = async (studentName: string) => {
    const student = getStudentInfo(studentName);

    if (!student?.email) {
      setError(`No email address is available for ${studentName}.`);
      setSuccessMessage("");
      return;
    }

    const draft = generatedEmails[studentName];
    if (!draft?.trim()) {
      setError(`The email draft for ${studentName} is empty.`);
      setSuccessMessage("");
      return;
    }

    try {
      setSendingStudent(studentName);

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: student.email,
          subject: getEmailSubject(studentName),
          message: draft,
          teacherName: teacherDisplayName,
          teacherEmail: teacherProfile?.email || "",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string" && data.error.trim()
            ? data.error
            : `Failed to send the email for ${studentName}.`
        );
      }

      setError("");
      setSuccessMessage(`Email sent to ${studentName} at ${student.email}.`);
    } catch (sendError) {
      setSuccessMessage("");
      setError(sendError instanceof Error ? sendError.message : `Failed to send the email for ${studentName}.`);
    } finally {
      setSendingStudent(null);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">AI Writer</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Generate personalized emails for campaigns and assignments.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Create targeted outreach, assignment notifications, reminders, and follow-ups automatically powered by AI.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Drafts will be signed as <span className="font-semibold text-[var(--foreground)]">{teacherDisplayName}</span> and will exclude filler placeholders.
        </p>
      </section>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Email Configuration</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Select Campaign
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              <option value="">-- Choose a campaign --</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Email Type
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as EmailType)}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              {Object.entries(emailTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {emailType === "custom" && (
          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Custom Prompt
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt for email generation..."
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
              rows={3}
            />
          </label>
        )}

        {allStudents.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--foreground)]">Select Students</p>
              <button
                onClick={toggleAllStudents}
                type="button"
                className="text-xs font-semibold text-[var(--signal-blue)] transition hover:opacity-80"
              >
                {selectedStudents.size === allStudents.length ? "Clear all" : "Add all"}
              </button>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4 space-y-2 max-h-48 overflow-y-auto">
              {getAllAvailableStudents().length > 0 ? (
                getAllAvailableStudents().map((student) => {
                  const studentDisplayName = `${student.firstName} ${student.lastName}`;
                  return (
                    <label key={student.id} className="flex items-center gap-3 cursor-pointer hover:bg-[var(--panel)] p-2 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(studentDisplayName)}
                        onChange={() => toggleStudentSelection(studentDisplayName)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium text-[var(--foreground)]">{studentDisplayName}</span>
                        {student.gradeLabel && (
                          <span className="text-xs text-[var(--muted)]">Grade: {student.gradeLabel}</span>
                        )}
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-[var(--muted)]">No students available</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-sm text-emerald-700">{successMessage}</p>
          </div>
        )}

        <button
          onClick={handleGenerateEmails}
          disabled={isLoading || (!selectedCampaignId && !selectedTaskId) || selectedStudents.size === 0}
          className="mt-6 rounded-full bg-[var(--signal-blue)] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? `Generating ${selectedStudents.size} emails...` : `Generate Emails for ${selectedStudents.size} Student${selectedStudents.size !== 1 ? 's' : ''}`}
        </button>
      </section>

      {Object.keys(generatedEmails).length > 0 && (
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Generated Emails</p>

          <div className="mt-6 space-y-4">
            {Array.from(selectedStudents).map((studentName) => (
              <div
                key={studentName}
                className="rounded-[24px] border border-[var(--border)] bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{studentName}</p>
                    <p className="text-xs text-[var(--muted)]">{getStudentInfo(studentName)?.email || "No student email on file"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyEmail(studentName)}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                    >
                      Copy Email
                    </button>
                    <button
                      onClick={() => handleSendEmail(studentName)}
                      disabled={sendingStudent === studentName}
                      className="rounded-full bg-[var(--signal-blue)] px-3 py-1 text-xs font-semibold text-black transition hover:opacity-90"
                    >
                      {sendingStudent === studentName ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </div>
                <textarea
                  value={generatedEmails[studentName] ?? ""}
                  onChange={(e) => handleEmailDraftChange(studentName, e.target.value)}
                  className="mt-4 min-h-44 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--signal-blue)]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Email Preview Modal */}
      {previewModalOpen && currentEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
          <div className="w-full max-w-2xl rounded-[30px] border border-[var(--border)] bg-white p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Review Email</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{currentStudent}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Email {currentPreviewIndex + 1} of {studentList.length}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {getStudentInfo(currentStudent)?.email || "No student email on file"}
                </p>
              </div>
              <button
                onClick={handleClosePreview}
                className="text-2xl font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                ×
              </button>
            </div>

            {/* Email Content */}
            <textarea
              value={currentEmail}
              onChange={(e) => handleEmailDraftChange(currentStudent, e.target.value)}
              className="mb-6 min-h-72 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--signal-blue)]"
            />

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevEmail}
                disabled={currentPreviewIndex === 0}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyEmail(currentStudent)}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                >
                  Copy Email
                </button>
                <button
                  onClick={() => handleSendEmail(currentStudent)}
                  disabled={sendingStudent === currentStudent}
                  className="rounded-full bg-[var(--signal-blue)] px-6 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  {sendingStudent === currentStudent ? "Sending..." : "Send Email"}
                </button>
              </div>

              <button
                onClick={handleNextEmail}
                disabled={currentPreviewIndex === studentList.length - 1}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>

            {/* Footer Info */}
            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              Review each draft, then send it directly through the configured email server.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}