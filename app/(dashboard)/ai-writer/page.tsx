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
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [emailType, setEmailType] = useState<EmailType>("campaign_launch");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load campaigns and tasks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
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

  const getAllAvailableStudents = () => {
    const campaign = getSelectedCampaign();
    return campaign?.selectedStudents || [];
  };

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

  const buildEmailPrompt = (studentName: string): string => {
    const context = buildContext();
    let basePrompt = "";

    switch (emailType) {
      case "campaign_launch":
        basePrompt = `Write a concise, friendly email to ${studentName} introducing this new campaign and explaining how it will help them.`;
        break;
      case "assignment_notification":
        basePrompt = `Write a brief email to ${studentName} notifying them about a new assignment and what they need to do.`;
        break;
      case "assignment_reminder":
        basePrompt = `Write a friendly reminder email to ${studentName} about an upcoming assignment deadline.`;
        break;
      case "follow_up_question":
        basePrompt = `Write a thoughtful follow-up email to ${studentName} asking about their progress and offering support.`;
        break;
      case "individual_feedback":
        basePrompt = `Write personalized feedback email to ${studentName} on their current work and progress.`;
        break;
      case "custom":
        basePrompt = customPrompt;
        break;
    }

    return `${context}\n\nBased on this context, please: ${basePrompt}\n\nMake it professional but friendly, and keep it under 150 words.`;
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
    setGeneratedEmails({});

    try {
      const emailsData: Record<string, string> = {};

      // Generate email for each selected student
      for (const studentName of Array.from(selectedStudents)) {
        const prompt = buildEmailPrompt(studentName);

        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate email");
        }

        const data = await response.json();
        emailsData[studentName] = data.content;
      }

      setGeneratedEmails(emailsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate emails");
      console.error("Error generating emails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmail = (studentName: string) => {
    if (generatedEmails[studentName]) {
      navigator.clipboard.writeText(generatedEmails[studentName]);
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

        {selectedCampaignId && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm font-medium text-[var(--foreground)]">Select Students</p>
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4 space-y-2 max-h-48 overflow-y-auto">
              {getAllAvailableStudents().length > 0 ? (
                getAllAvailableStudents().map((studentName) => (
                  <label key={studentName} className="flex items-center gap-3 cursor-pointer hover:bg-[var(--panel)] p-2 rounded-lg transition">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(studentName)}
                      onChange={() => toggleStudentSelection(studentName)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-[var(--foreground)]">{studentName}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No students in this campaign</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-4">
            <p className="text-sm text-red-700">{error}</p>
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
                  <p className="font-semibold text-[var(--foreground)]">{studentName}</p>
                  <button
                    onClick={() => handleCopyEmail(studentName)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    Copy Email
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground)]/84 whitespace-pre-wrap border-t border-[var(--border)] pt-4">
                  {generatedEmails[studentName]}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}