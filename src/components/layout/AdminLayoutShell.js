"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayoutShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AdminSidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main id="main-content" className="flex-1 p-4 lg:p-8 outline-none" tabIndex="-1">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
