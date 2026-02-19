import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/de/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar session={session} />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader session={session} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
