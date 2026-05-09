import Link from "next/link";
import { Ship, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8">
        <Ship size={40} />
      </div>
      <h1 className="text-6xl font-black tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-muted mt-2 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved to a new location.
      </p>
      <Link href="/" className="mt-10">
        <Button size="lg" className="rounded-2xl px-10 h-14 font-bold shadow-lg shadow-primary/20">
          <Home className="mr-2" size={20} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
