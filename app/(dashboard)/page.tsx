import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to the active campaigns page as the default dashboard view
  redirect("/active-campaigns");
}
