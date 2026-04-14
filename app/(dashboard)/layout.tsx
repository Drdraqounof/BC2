import { SidebarShell } from "../components/sidebar-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarShell>{children}</SidebarShell>;
}