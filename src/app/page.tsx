import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // NEXTAUTH_SECRET ausente ou inválido — tratar como sem sessão
  }

  if (session) {
    const role = session.user?.role;
    if (role === "ADMIN") redirect("/admin");
    if (role === "INSTRUCTOR") redirect("/instrutor");
    redirect("/dashboard");
  }
  redirect("/home");
}
