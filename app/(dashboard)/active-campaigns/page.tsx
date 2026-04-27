"use client";

import { useMemo, useState } from "react";

import { activeCampaigns, studentList, mockTasks, type CampaignGoalType, type CampaignRecord, type TaskRecord } from "../../dashboard-data";

type CampaignStatus = CampaignRecord["status"];

type CampaignFormState = {
  title: string;
  description: string;
  goal: string;
  goalType: CampaignGoalType;
  selectedStudents: string[];
  status: CampaignStatus;
};

const goalTypeOptions: CampaignGoalType[] = ["Attendance", "Grades", "Behavior", "Custom"];
const statusOptions: CampaignStatus[] = ["Draft", "In Progress", "Needs Follow-Up", "On Track", "Completed"];
const accentByGoalType: Record<CampaignGoalType, string> = {
  Attendance: "bg-[var(--signal-gold)]",
  Grades: "bg-[var(--signal-red)]",
  Behavior: "bg-[var(--signal-green)]",
  Custom: "bg-[var(--signal-blue)]",
};

function formatStudentSegment(selectedStudents: string[]) {
  if (selectedStudents.length === 0) {
    return "No students selected";
  }

  return `${selectedStudents.length} student${selectedStudents.length === 1 ? "" : "s"}`;
}

function getStudentPreview(selectedStudents: string[]) {
  if (selectedStudents.length === 0) {
    return "Choose students for this campaign.";
  }

  return selectedStudents.join(", ");
}

function getEmptyForm(): CampaignFormState {
  return {
    title: "",
    description: "",
    goal: "",
    goalType: "Custom",
    selectedStudents: [],
    status: "Draft",
  };
}

function getFieldHighlight(isEmpty: boolean): string {
  return isEmpty ? "bg-amber-50/50 border-amber-200" : "";
}

function isFieldEmpty(field: string | string[]): boolean {
  if (Array.isArray(field)) {
    return field.length === 0;
  }
  return field.trim() === "";
}

export default function ActiveCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(activeCampaigns);
  const [form, setForm] = useState<CampaignFormState>(getEmptyForm);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskRecord[]>(mockTasks);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const visibleCampaigns = useMemo(
    () => campaigns.filter((campaign) => !campaign.archived),
    [campaigns],
  );

  const archivedCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.archived),
    [campaigns],
  );

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null,
    [campaigns, selectedCampaignId],
  );

  const campaignTasks = useMemo(
    () => selectedCampaignId ? tasks.filter((task) => task.campaignId === selectedCampaignId) : [],
    [tasks, selectedCampaignId],
  );

  function handleFieldChange<K extends keyof CampaignFormState>(field: K, value: CampaignFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setShowErrorNotification(false);
  }

  function resetForm() {
    setForm(getEmptyForm());
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: string[] = [];
    const title = form.title.trim();
    const description = form.description.trim();
    const goal = form.goal.trim();
    const selectedStudents = form.selectedStudents;

    if (!title) {
      errors.push("Campaign title is required");
    }
    if (selectedStudents.length === 0) {
      errors.push("Student segment is required - please select at least one student");
    }
    if (!description) {
      errors.push("Campaign details are required");
    }
    if (!goal) {
      errors.push("Goal is required");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorNotification(true);
      return;
    }

    if (selectedCampaignId && isEditingDetails) {
      setCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === selectedCampaignId
            ? {
                ...campaign,
                title,
                description,
                goal,
                students: formatStudentSegment(selectedStudents),
                selectedStudents,
                goalType: form.goalType,
                status: form.status,
                accent: accentByGoalType[form.goalType],
              }
            : campaign,
        ),
      );
      setIsEditingDetails(false);
      setValidationErrors([]);
      setShowErrorNotification(false);
      return;
    }

    setCampaigns((current) => [
      {
        id: `campaign-${crypto.randomUUID()}`,
        title,
        description,
        goal,
        students: formatStudentSegment(selectedStudents),
        selectedStudents,
        goalType: form.goalType,
        status: form.status,
        progress: 0,
        accent: accentByGoalType[form.goalType],
        archived: false,
      },
      ...current,
    ]);

    resetForm();
    setValidationErrors([]);
    setShowErrorNotification(false);
  }

  function openCampaignDetails(campaign: CampaignRecord, editMode = false) {
    setSelectedCampaignId(campaign.id);
    setForm({
      title: campaign.title,
      description: campaign.description,
      goal: campaign.goal,
      goalType: campaign.goalType,
      selectedStudents: campaign.selectedStudents,
      status: campaign.status,
    });
    setIsEditingDetails(editMode);
  }

  function closeCampaignDetails() {
    setSelectedCampaignId(null);
    setIsEditingDetails(false);
    resetForm();
  }

  function completeCampaign(id: string) {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status: "Completed",
              progress: 100,
            }
          : campaign,
      ),
    );
  }

  function archiveCampaign(id: string) {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              archived: true,
            }
          : campaign,
      ),
    );

    if (selectedCampaignId === id) {
      setSelectedCampaignId(id);
    }
  }

  function restoreCampaign(id: string) {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              archived: false,
            }
          : campaign,
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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-[34px] border border-white/60 bg-white/74 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
          Active Campaigns
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Structured interventions with clear goals and visible status.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Review the students affected, the goal for each campaign, and the next action teachers should take.
        </p>
      </section>

      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
              Campaign Manager
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Create campaigns, update details, and close the loop.
            </h2>
          </div>
        </div>

        {showErrorNotification && validationErrors.length > 0 && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-[var(--signal-red)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[var(--signal-red)]">
                  Please complete the following to create your campaign:
                </h3>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setShowErrorNotification(false)}
                className="mt-0.5 flex-shrink-0 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Campaign title
            <input
              value={form.title}
              onChange={(event) => handleFieldChange("title", event.target.value)}
              className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)] ${
                isFieldEmpty(form.title)
                  ? "border-red-200 bg-red-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
              placeholder="Attendance recovery sprint"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Student segment
            <button
              type="button"
              onClick={() => setIsStudentPickerOpen(true)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-[var(--signal-blue)] ${
                isFieldEmpty(form.selectedStudents)
                  ? "border-red-200 bg-red-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
            >
              <span className="block font-medium text-[var(--foreground)]">
                {formatStudentSegment(form.selectedStudents)}
              </span>
              <span className="mt-1 block text-[var(--muted)]">
                {getStudentPreview(form.selectedStudents)}
              </span>
            </button>
          </label>

          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Campaign details
            <textarea
              value={form.description}
              onChange={(event) => handleFieldChange("description", event.target.value)}
              className={`min-h-28 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)] ${
                isFieldEmpty(form.description)
                  ? "border-red-200 bg-red-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
              placeholder="Describe what this intervention is solving and the teacher action it supports."
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Goal
            <input
              value={form.goal}
              onChange={(event) => handleFieldChange("goal", event.target.value)}
              className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)] ${
                isFieldEmpty(form.goal)
                  ? "border-red-200 bg-red-50/50"
                  : "border-green-200 bg-green-50/50"
              }`}
              placeholder="Raise weekly attendance to 95%"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Goal type
            <select
              value={form.goalType}
              onChange={(event) => handleFieldChange("goalType", event.target.value as CampaignGoalType)}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              {goalTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
            Status
            <select
              value={form.status}
              onChange={(event) => handleFieldChange("status", event.target.value as CampaignStatus)}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
            >
              Create campaign
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {visibleCampaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                    {campaign.title}
                  </h2>
                  {tasks.filter(t => t.campaignId === campaign.id).length > 0 && (
                    <span className="rounded-full bg-[var(--signal-blue)] px-2 py-1 text-xs font-semibold text-white">
                      {tasks.filter(t => t.campaignId === campaign.id).length}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{campaign.students}</p>
              </div>
              <span className={`h-3 w-3 rounded-full ${campaign.accent}`} />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/82">
              {campaign.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="rounded-full bg-white px-3 py-2 text-[var(--foreground)]">
                {campaign.goalType}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-[var(--foreground)]">
                {campaign.status}
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[var(--foreground)]/82">
              Goal: {campaign.goal}
            </p>
            <div className="mt-5 rounded-[24px] bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Status</span>
                <span className="font-medium">{campaign.status}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--panel-strong)]">
                <div className={`h-2 rounded-full ${campaign.accent}`} style={{ width: `${campaign.progress}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {campaign.progress}% toward goal
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openCampaignDetails(campaign)}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => openCampaignDetails(campaign, true)}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white"
              >
                Edit details
              </button>
              {tasks.filter(t => t.campaignId === campaign.id).length > 0 && (
                <button
                  type="button"
                  onClick={() => openCampaignDetails(campaign)}
                  className="rounded-full border border-[var(--signal-blue)] px-4 py-2 text-sm font-medium text-[var(--signal-blue)] transition hover:bg-[var(--signal-blue)]/10"
                >
                  View tasks
                </button>
              )}
              <button
                type="button"
                onClick={() => completeCampaign(campaign.id)}
                className="rounded-full bg-[var(--signal-green)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Complete campaign
              </button>
              <button
                type="button"
                onClick={() => archiveCampaign(campaign.id)}
                className="rounded-full bg-[var(--signal-gold)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Archive campaign
              </button>
            </div>
          </article>
        ))}
      </section>

      {archivedCampaigns.length > 0 ? (
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                Archived Campaigns
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                Completed or paused interventions kept for reference.
              </h2>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]">
              {archivedCampaigns.length} archived
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {archivedCampaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="rounded-[24px] border border-[var(--border)] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {campaign.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{campaign.students}</p>
                  </div>
                  <span className="rounded-full bg-[var(--panel)] px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground)]">
                    {campaign.goalType}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/82">{campaign.description}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/82">Goal: {campaign.goal}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => restoreCampaign(campaign.id)}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    Restore campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => openCampaignDetails(campaign, true)}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                  >
                    Edit details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {selectedCampaign ? (
        <section className="fixed inset-0 z-50 flex min-h-screen items-stretch bg-slate-950/45 backdrop-blur-sm">
          <div className="h-screen w-full overflow-y-auto bg-[var(--panel)] px-6 py-6 md:px-10 md:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:flex-row md:items-start md:justify-between md:p-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                    Campaign detail view
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                    {selectedCampaign.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
                    Open the full campaign record, review every field, and edit without being limited to the card preview.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {!isEditingDetails ? (
                    <button
                      type="button"
                      onClick={() => openCampaignDetails(selectedCampaign, true)}
                      className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                    >
                      Edit campaign
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={closeCampaignDetails}
                    className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
                  >
                    Exit
                  </button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                      Goal type: {selectedCampaign.goalType}
                    </span>
                    <span className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                      Status: {selectedCampaign.status}
                    </span>
                    <span className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                      Segment: {selectedCampaign.students}
                    </span>
                    <span className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                      Progress: {selectedCampaign.progress}%
                    </span>
                    <span className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                      State: {selectedCampaign.archived ? "Archived" : "Active"}
                    </span>
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="rounded-[24px] bg-[var(--panel)] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        Goal
                      </p>
                      <p className="mt-3 text-base leading-8 text-[var(--foreground)]">
                        {selectedCampaign.goal}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[var(--panel)] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        Student segment
                      </p>
                      <p className="mt-3 text-base leading-8 text-[var(--foreground)]">
                        {selectedCampaign.students}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                      Selected students
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {selectedCampaign.selectedStudents.map((studentName) => (
                        <span
                          key={studentName}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)]"
                        >
                          {studentName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                      Full description
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-[var(--foreground)]">
                      {selectedCampaign.description}
                    </p>
                  </div>

                  <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">Campaign progress</span>
                      <span className="font-medium text-[var(--foreground)]">{selectedCampaign.progress}%</span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-white">
                      <div className={`h-3 rounded-full ${selectedCampaign.accent}`} style={{ width: `${selectedCampaign.progress}%` }} />
                    </div>
                  </div>

                  {campaignTasks.length > 0 && (
                    <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        Campaign Tasks ({campaignTasks.length})
                      </p>
                      <div className="mt-3 space-y-2">
                        {campaignTasks.map((task) => (
                          <div key={task.id} className="rounded-lg bg-white p-3 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-[var(--foreground)]">{task.title}</p>
                                <p className="text-xs text-[var(--muted)]">
                                  {task.completedCount} of {task.studentCount} students completed
                                </p>
                              </div>
                              <span className={`rounded px-2 py-1 text-xs font-medium text-white ${
                                task.priority === 'HIGH' ? 'bg-[var(--signal-red)]' :
                                task.priority === 'MEDIUM' ? 'bg-[var(--signal-gold)]' :
                                'bg-[var(--signal-green)]'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.dueDate && (
                              <p className="mt-2 text-xs text-[var(--muted)]">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                        {isEditingDetails ? "Edit campaign" : "Campaign controls"}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                        {isEditingDetails ? "Update the full campaign record" : "Quick actions"}
                      </h3>
                    </div>
                  </div>

                  {isEditingDetails ? (
                    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Campaign title
                        <input
                          value={form.title}
                          onChange={(event) => handleFieldChange("title", event.target.value)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Campaign details
                        <textarea
                          value={form.description}
                          onChange={(event) => handleFieldChange("description", event.target.value)}
                          className="min-h-36 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Goal
                        <input
                          value={form.goal}
                          onChange={(event) => handleFieldChange("goal", event.target.value)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Student segment
                        <button
                          type="button"
                          onClick={() => setIsStudentPickerOpen(true)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-left text-sm transition hover:border-[var(--signal-blue)]"
                        >
                          <span className="block font-medium text-[var(--foreground)]">
                            {formatStudentSegment(form.selectedStudents)}
                          </span>
                          <span className="mt-1 block text-[var(--muted)]">
                            {getStudentPreview(form.selectedStudents)}
                          </span>
                        </button>
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Goal type
                        <select
                          value={form.goalType}
                          onChange={(event) => handleFieldChange("goalType", event.target.value as CampaignGoalType)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                        >
                          {goalTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
                        Status
                        <select
                          value={form.status}
                          onChange={(event) => handleFieldChange("status", event.target.value as CampaignStatus)}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm outline-none transition focus:border-[var(--signal-blue)]"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="submit"
                          className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-92"
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingDetails(false)}
                          className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                        >
                          Stop editing
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingDetails(true)}
                        className="rounded-2xl border border-[var(--border)] px-5 py-4 text-left text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                      >
                        Edit this campaign in full-screen mode
                      </button>
                      <button
                        type="button"
                        onClick={() => completeCampaign(selectedCampaign.id)}
                        className="rounded-2xl bg-[var(--signal-green)] px-5 py-4 text-left text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Mark campaign as completed
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveCampaign(selectedCampaign.id)}
                        className="rounded-2xl bg-[var(--signal-gold)] px-5 py-4 text-left text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Archive this campaign
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border-2 border-[var(--signal-blue)] px-5 py-4 text-left text-sm font-medium text-[var(--signal-blue)] transition hover:bg-[var(--signal-blue)]/5"
                      >
                        {campaignTasks.length > 0 ? `View & manage tasks (${campaignTasks.length})` : "Create task for this campaign"}
                      </button>
                      {selectedCampaign.archived ? (
                        <button
                          type="button"
                          onClick={() => restoreCampaign(selectedCampaign.id)}
                          className="rounded-2xl border border-[var(--border)] px-5 py-4 text-left text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--panel)]"
                        >
                          Restore campaign to active list
                        </button>
                      ) : null}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isStudentPickerOpen ? (
        <section className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] border border-[var(--border)] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                  Student segment picker
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  Choose students for this campaign
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  Select one or more students to attach to the campaign. The campaign segment will update automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentPickerOpen(false)}
                className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
              >
                Done
              </button>
            </div>

            <div className="mt-6 rounded-[24px] bg-[var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Current segment
              </p>
              <p className="mt-3 text-base font-medium text-[var(--foreground)]">
                {formatStudentSegment(form.selectedStudents)}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {getStudentPreview(form.selectedStudents)}
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {studentList.map((student) => {
                const isSelected = form.selectedStudents.includes(student.name);

                return (
                  <button
                    key={student.name}
                    type="button"
                    onClick={() => toggleStudentSelection(student.name)}
                    className={`grid gap-3 rounded-[24px] border p-4 text-left transition md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center ${
                      isSelected
                        ? "border-[var(--signal-blue)] bg-[var(--panel)]"
                        : "border-[var(--border)] bg-white hover:bg-[var(--panel)]"
                    }`}
                  >
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                        {student.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{student.grade}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Signal</p>
                      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{student.signal}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Status</p>
                      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{student.status}</p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-medium ${isSelected ? "bg-[var(--foreground)] text-white" : "bg-[var(--panel)] text-[var(--foreground)]"}`}>
                      {isSelected ? "Selected" : "Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}