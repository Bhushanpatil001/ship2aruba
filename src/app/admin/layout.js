import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminLayoutShell from "@/components/layout/AdminLayoutShell";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/client/dashboard");
  }

  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
