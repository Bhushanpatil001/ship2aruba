import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientLayoutShell from "@/components/layout/ClientLayoutShell";

export default async function ClientLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Ensure clients don't access admin pages (handled in admin layout), 
  // but also ensure admins don't accidentally use client portal for tasks?
  // Usually, admins can view client portal, but let's keep roles strict if needed.

  return (
    <ClientLayoutShell session={session}>
      {children}
    </ClientLayoutShell>
  );
}
