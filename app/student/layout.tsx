import { SidebarShell } from "../components/sidebar-shell";

const studentNavigationItems = [
  { href: "/student", label: "My Tasks", shortLabel: "MT" },
  { href: "/student/campaigns", label: "My Campaigns", shortLabel: "MC" },
  { href: "/student/submissions", label: "Submissions", shortLabel: "SB" },
  { href: "/student/feedback", label: "Feedback", shortLabel: "FB" },
  { href: "/student/progress", label: "My Progress", shortLabel: "MP" },
  { href: "/student/profile", label: "My Profile", shortLabel: "PF" },
];

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarShell
      workspaceLabel="Student Workspace"
      navigationItems={studentNavigationItems}
      logoutRole="student"
      systemNote="Your workspace stays focused on your assigned tasks, campaign progress, and the next action you need to take."
    >
      {children}
    </SidebarShell>
  );
}