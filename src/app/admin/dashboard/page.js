"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  FileCheck, 
  Ship, 
  ArrowUpRight, 
  Clock,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (active) setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const stats = [
    { 
      name: "Total Packages", 
      value: statsData?.totalPackages || 0, 
      change: "All Time", 
      trend: "up",
      icon: Package, 
      color: "bg-blue-600" 
    },
    { 
      name: "Pending Reviews", 
      value: statsData?.pendingReviews || 0, 
      change: "Action Needed", 
      trend: "down",
      icon: FileCheck, 
      color: "bg-amber-600" 
    },
    { 
      name: "Ship Requests", 
      value: statsData?.shipRequests || 0, 
      change: "Current", 
      trend: "up",
      icon: Ship, 
      color: "bg-purple-600" 
    },
    { 
      name: "Active Clients", 
      value: statsData?.activeClients || 0, 
      change: "Growth", 
      trend: "up",
      icon: Users, 
      color: "bg-emerald-600" 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted font-medium">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Operations Dashboard</h1>
        <p className="mt-2 text-muted">Real-time overview of the Ship2Aruba platform.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.name} variants={item}>
            <Card className="overflow-hidden border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-xl p-3 text-white shadow-lg shadow-primary/10", stat.color)}>
                    <stat.icon size={24} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                    stat.value > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-muted"
                  )}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted">{stat.name}</p>
                  <h3 className="text-3xl font-bold text-foreground mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border bg-card">
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>System metrics and recent activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {statsData?.pendingReviews > 0 ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <AlertCircle className="text-amber-600" size={24} />
                  <div>
                    <p className="font-bold text-foreground">{statsData.pendingReviews} Invoices Awaiting Review</p>
                    <p className="text-sm text-muted">Immediate action required to process shipments.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <Package className="text-emerald-600" size={24} />
                  <div>
                    <p className="font-bold text-foreground">Queue is Clear</p>
                    <p className="text-sm text-muted">All incoming packages have been processed.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border bg-card">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Critical item monitoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary p-2 text-white">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Next Shipment Sync</p>
                    <p className="text-xs text-muted">Automatic check in 14 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

