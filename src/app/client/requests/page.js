"use client";

import { useState, useEffect } from "react";
import { Truck, CheckCircle2, Plus, Loader2, Package as PackageIcon, ArrowRight, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

export default function ShipRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [approvedPackages, setApprovedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    try {
      const [shipRes, pkgRes] = await Promise.all([
        fetch("/api/shipments"),
        fetch("/api/client/packages")
      ]);
      const shipData = await shipRes.json();
      const pkgData = await pkgRes.json();
      
      setRequests(shipData.shipments || []);
      setApprovedPackages((pkgData.packages || []).filter(p => p.status === "INVOICE_APPROVED"));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await fetchData();
    };
    load();
    return () => { active = false; };
  }, []);

  const handleCreateRequest = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageIds: selectedIds }),
      });
      if (res.ok) {
        setShowCreate(false);
        setSelectedIds([]);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  };

  const togglePackage = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (showCreate) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Shipment</h1>
            <p className="mt-2 text-muted">Select approved packages to consolidate into one shipment.</p>
          </div>
          <Button variant="ghost" onClick={() => setShowCreate(false)} className="rounded-full">
            <X size={20} className="mr-2" /> Cancel
          </Button>
        </div>

        <div className="grid gap-4">
          {approvedPackages.length > 0 ? (
            <>
              {approvedPackages.map((pkg) => (
                <div 
                  key={pkg._id} 
                  onClick={() => togglePackage(pkg._id)}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between",
                    selectedIds.includes(pkg._id) 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                      selectedIds.includes(pkg._id) ? "bg-primary text-white" : "bg-muted/10 text-muted"
                    )}>
                      <PackageIcon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{pkg.description}</p>
                      <p className="text-sm text-muted font-mono">#{pkg.trackingNumber}</p>
                    </div>
                  </div>
                  {selectedIds.includes(pkg._id) && <CheckCircle2 className="text-primary" size={24} />}
                </div>
              ))}
              
              <div className="pt-6 border-t border-border sticky bottom-0 bg-background/80 backdrop-blur-md pb-4">
                <Button 
                  disabled={selectedIds.length === 0}
                  onClick={handleCreateRequest}
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                >
                  Request Shipment for {selectedIds.length} Packages
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="py-20 text-center">
                <PackageIcon className="mx-auto mb-4 text-muted/30" size={48} />
                <h3 className="text-xl font-bold">No packages ready</h3>
                <p className="text-muted mt-2">Only packages with approved invoices can be shipped.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ship Requests</h1>
          <p className="mt-2 text-muted">Track your consolidated shipments to Aruba.</p>
        </div>
        <Button 
          onClick={() => setShowCreate(true)}
          className="shadow-lg shadow-primary/20 rounded-xl h-12 px-6"
        >
          <Plus className="mr-2" size={18} />
          New Consolidation
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-sm font-medium text-muted">Loading your requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request._id} className="border-border bg-card group hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Truck size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-foreground text-lg">Shipment #{request._id.slice(-6).toUpperCase()}</p>
                        <Badge variant={request.status === "SHIPPED" ? "success" : "blue"}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted mt-1">Consolidated on {formatDate(request.createdAt)}</p>
                      {request.trackingNumber && (
                        <p className="text-xs font-bold text-primary mt-1 font-mono">TRACKING: {request.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex -space-x-3 overflow-hidden">
                    {request.packageIds.map((pkg, i) => (
                      <div 
                        key={pkg._id} 
                        className="h-10 w-10 rounded-full border-2 border-card bg-muted flex items-center justify-center shadow-sm"
                        title={pkg.description}
                      >
                        <PackageIcon size={16} className="text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-muted/10 p-8 text-muted/30 mb-8">
              <Truck size={64} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Ready to Ship?</h2>
            <p className="text-muted mt-2 max-w-sm mx-auto">
              Once your package invoices are approved, you can select them to create a consolidation request and ship them to Aruba.
            </p>
            <Button variant="outline" className="mt-8 rounded-xl" onClick={() => setShowCreate(true)}>
              <PackageIcon className="mr-2" size={18} />
              Check Approved Packages
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
