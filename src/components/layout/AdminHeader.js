"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Menu, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function DashboardHeader({ setSidebarOpen, role = "ADMIN" }) {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-muted hover:text-foreground"
          aria-label="Open sidebar menu"
        >
          <Menu size={24} />
        </Button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-foreground tracking-tight">Ship2Aruba</span>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <ThemeToggle />
        
        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 group cursor-pointer focus:outline-none"
            aria-label="User profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="hidden text-right lg:block">
              <p className="text-sm font-bold text-foreground leading-none">{session?.user?.name || "User"}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{session?.user?.role || role}</p>
            </div>
            
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/10 text-muted transition-all overflow-hidden shadow-sm",
              profileOpen ? "border-primary text-primary" : "group-hover:border-primary/50 group-hover:text-primary/50"
            )}>
              <UserIcon size={20} />
            </div>
            <ChevronDown size={14} className={cn("text-muted transition-transform duration-200", profileOpen && "rotate-180")} />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 animate-in zoom-in-95 duration-200 origin-top-right z-50">
                <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
                  <div className="px-4 py-3 border-b border-border mb-1">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-foreground truncate">{session?.user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-500/10 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <LogOut size={18} />
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
