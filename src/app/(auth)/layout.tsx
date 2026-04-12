import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-primary">cfia</span>
      </Link>
      {children}
    </div>
  );
}
