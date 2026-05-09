"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  UploadCloud, 
  Truck, 
  AlertCircle,
  ChevronRight,
  Info,
  Loader2,
  Box,
  X,
  FileText,
  CheckCircle2,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusStyles, formatStatus } from "@/lib/utils";
import Link from "next/link";

export default function ClientDashboard() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPkg, setUploadingPkg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/client/packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await fetchPackages();
    };
    load();
    return () => { active = false; };
  }, []);

  const handleUpload = async () => {
    if (!uploadingPkg) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("trackingNumber", uploadingPkg.trackingNumber);

      const res = await fetch("/api/client/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadingPkg(null);
          setSelectedFile(null);
          setUploadSuccess(false);
          fetchPackages();
        }, 1500);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { 
      label: "In Locker", 
      count: packages.filter(p => ["READY_TO_SEND", "PENDING_INVOICE_REVIEW", "NEEDS_REVIEW"].includes(p.status)).length, 
      icon: Box, 
      color: "text-blue-600", 
      bg: "bg-blue-500/10" 
    },
    { 
      label: "Awaiting Action", 
      count: packages.filter(p => ["READY_TO_SEND", "NEEDS_REVIEW"].includes(p.status)).length, 
      icon: AlertCircle, 
      color: "text-amber-600", 
      bg: "bg-amber-500/10" 
    },
    { 
      label: "In Transit", 
      count: packages.filter(p => p.status === "SHIPPED").length, 
      icon: Truck, 
      color: "text-indigo-600", 
      bg: "bg-indigo-500/10" 
    },
  ];

  const actionRequired = packages.filter(p => ["READY_TO_SEND", "NEEDS_REVIEW"].includes(p.status));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted font-medium">Loading your locker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Locker</h1>
          <p className="mt-2 text-muted">Manage your arrived items and shipping requests.</p>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadingPkg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Upload Invoice</CardTitle>
                  <CardDescription className="font-mono text-xs">#{uploadingPkg.trackingNumber}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setUploadingPkg(null)} className="rounded-full">
                <X size={20} />
              </Button>
            </div>
            <CardContent className="p-8">
              {uploadSuccess ? (
                <div className="flex flex-col items-center py-6 text-center animate-in zoom-in duration-300">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Upload Complete</h3>
                  <p className="text-sm text-muted mt-1">Our team will review your invoice shortly.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl border-2 border-dashed border-border bg-muted/5 p-10 text-center group hover:border-primary/50 transition-colors">
                    {selectedFile ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-4">
                          <FileText size={28} />
                        </div>
                        <p className="font-bold text-foreground truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedFile(null)}
                          className="mt-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <X size={16} className="mr-2" /> Remove File
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                          <FileText size={28} />
                        </div>
                        <h3 className="font-bold text-foreground">Attach Invoice</h3>
                        <p className="text-xs text-muted mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          id="dashboard-file-upload" 
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <Button variant="outline" className="mt-4 rounded-xl" onClick={() => document.getElementById('dashboard-file-upload').click()}>
                          Browse Files
                        </Button>
                      </>
                    )}
                  </div>
                  <Button 
                    onClick={handleUpload} 
                    disabled={uploading || !selectedFile} 
                    className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    Submit for Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{stat.count}</h3>
              </div>
              <div className={cn("rounded-2xl p-4", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {actionRequired.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground font-display">Action Required</h2>
            <Badge variant="warning" className="animate-pulse py-1 px-3 rounded-full">{actionRequired.length} Items Need Attention</Badge>
          </div>

          <div className="grid gap-4">
            {actionRequired.map((pkg) => (
              <Card key={pkg._id} className="border-amber-500/20 bg-amber-500/5 group hover:border-amber-500/40 transition-all">
                <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{pkg.status === "NEEDS_REVIEW" ? "Invoice Rejected" : "Missing Invoice"}</p>
                      <p className="text-sm text-muted">Tracking: <span className="font-mono">{pkg.trackingNumber}</span></p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setUploadingPkg(pkg)}
                    className="bg-amber-600 hover:bg-amber-700 h-10 px-6 rounded-xl font-bold shadow-lg shadow-amber-600/20"
                  >
                    Upload Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recently Arrived</h2>
          <Link href="/client/packages" className="text-sm font-bold text-primary hover:underline">View All Packages</Link>
        </div>
        
        <Card className="border-border bg-card overflow-hidden shadow-lg shadow-primary/5">
          {packages.length > 0 ? (
            <div className="divide-y divide-border">
              {packages.slice(0, 5).map((pkg) => (
                <div key={pkg._id} className="p-6 hover:bg-muted/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-muted group-hover:text-primary group-hover:border-primary/30 transition-all">
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{pkg.description}</p>
                          <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold border", getStatusStyles(pkg.status))}>
                            {formatStatus(pkg.status)}
                          </span>
                        </div>
                        <p className="text-sm text-muted mt-0.5">Tracking: {pkg.trackingNumber}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center text-muted">
              <Box size={48} className="mx-auto opacity-20 mb-4" />
              <p>Your locker is currently empty.</p>
              <p className="text-sm">New arrivals will appear here once processed.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
