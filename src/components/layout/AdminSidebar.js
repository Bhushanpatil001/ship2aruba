"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings,
  Ship,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "All Packages", href: "/admin/packages", icon: Package },
  { name: "Clients", href: "/admin/clients", icon: Users },
];

export default function AdminSidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 border-r border-border bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link href="/admin/dashboard" className={cn(
              "flex items-center gap-2 group transition-all overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Ship size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">Ship2Aruba</span>
            </Link>

            {/* Desktop Collapse / Mobile Close */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
                else setIsCollapsed(!isCollapsed);
              }}
              className="text-muted hover:text-foreground hover:bg-muted/10 rounded-xl"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted hover:bg-muted/10 hover:text-foreground",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={22} className={cn(
                      "flex-none",
                      isActive ? "text-primary" : "text-muted group-hover:text-foreground"
                    )} />
                    {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>}
                  </div>
                  {!isCollapsed && isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-muted hover:bg-muted/10 hover:text-foreground transition-colors",
                isCollapsed ? "justify-center" : ""
              )}
              title={isCollapsed ? "Settings" : ""}
            >
              <Settings size={22} className="flex-none" />
              {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Settings</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
