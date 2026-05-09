"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Package, 
  Ship,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/layout/AdminHeader";

const menuItems = [
  { name: "Dashboard", href: "/client/dashboard", icon: Home },
  { name: "My Packages", href: "/client/packages", icon: Package },
];

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Client Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[80] border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col p-4 md:p-6">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/client/dashboard" className={cn(
              "flex items-center gap-3 group transition-all duration-300 overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <Ship size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">Ship2Aruba</span>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false);
                else setIsCollapsed(!isCollapsed);
              }}
              className="text-muted hover:text-foreground hover:bg-muted/10 rounded-xl"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {!isCollapsed && (
            <div className="mb-8 rounded-2xl bg-primary/10 p-4 border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Your US Suite</p>
              <p className="text-lg font-bold text-foreground">{session?.user?.suiteNumber || "S2A-XXXX"}</p>
            </div>
          )}

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted hover:bg-muted/10 hover:text-foreground",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={22} className={cn("flex-none", isActive ? "text-white" : "text-muted group-hover:text-foreground")} />
                    {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight size={16} className="text-white/70" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full rounded-xl font-bold text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-all",
                isCollapsed ? "justify-center" : "justify-start px-4"
              )}
              onClick={() => signOut({ callbackUrl: "/login" })}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <LogOut size={22} className={cn(isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <AdminHeader setSidebarOpen={setSidebarOpen} role="CLIENT" />
        <main className="flex-1 p-4 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
