"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  FileCheck, 
  History,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Package as PackageIcon,
  ChevronDown,
  Plus,
  Box,
  Scale,
  Maximize2,
  Save,
  AlertCircle,
  X,
  Truck,
  ExternalLink
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, getStatusStyles, formatStatus, formatDate } from "@/lib/utils";

export default function AllPackages() {
  const [packages, setPackages] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingPkg, setReviewingPkg] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  
  // Intake Form State
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [intakeError, setIntakeError] = useState("");
  const [formData, setFormData] = useState({
    trackingNumber: "",
    clientId: "",
    description: "",
    width: "",
    height: "",
    length: "",
    weight: ""
  });

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  const fetchShipments = async () => {
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      setShipments(data.shipments || []);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchPackages(), fetchShipments(), fetchClients()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleReviewAction = async (id, status) => {
    setLoadingId(id);
    setActionLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNotes: adminNote })
      });
      if (res.ok) {
        setReviewingPkg(null);
        setAdminNote("");
        fetchPackages();
      }
    } catch (err) {
      console.error("Failed to update package:", err);
    } finally {
      setActionLoading(false);
      setLoadingId(null);
    }
  };

  const handleShipmentAction = async (pkgId, status) => {
    const shipment = shipments.find(s => s.packageIds.some(p => (p._id || p) === pkgId));
    if (!shipment) return;

    setActionLoading(true);
    setLoadingId(pkgId);
    
    try {
      const res = await fetch("/api/shipments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shipment._id, status })
      });
      
      if (res.ok) {
        await Promise.all([fetchShipments(), fetchPackages()]);
      }
    } catch (err) {
      console.error("Failed to update shipment:", err);
    } finally {
      setActionLoading(false);
      setLoadingId(null);
    }
  };

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    
    // Form Validation
    if (!formData.trackingNumber.trim()) return setIntakeError("Tracking number is required");
    if (!formData.clientId) return setIntakeError("Please select a client to assign this package");
    if (!formData.description.trim()) return setIntakeError("Contents description is required for customs");
    if (!formData.weight || formData.weight <= 0) return setIntakeError("Please enter a valid weight");
    if (!formData.width || !formData.height || !formData.length) return setIntakeError("All dimensions are required");
    
    setIntakeError("");
    setIntakeLoading(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dimensions: {
            width: Number(formData.width),
            height: Number(formData.height),
            length: Number(formData.length),
            weight: Number(formData.weight)
          }
        })
      });

      if (res.ok) {
        setShowIntakeModal(false);
        setFormData({
          trackingNumber: "",
          clientId: "",
          description: "",
          width: "",
          height: "",
          length: "",
          weight: ""
        });
        fetchPackages();
      } else {
        const data = await res.json();
        setIntakeError(data.error || "Failed to log package");
      }
    } catch (err) {
      setIntakeError("An unexpected error occurred");
    } finally {
      setIntakeLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Logistics Database</h1>
          <p className="mt-2 text-muted font-medium italic">Manage package intake and dispatch in one unified view.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowIntakeModal(true)}
            className="rounded-xl h-12 px-8 shadow-xl shadow-primary/20 bg-primary hover:brightness-110 font-bold"
          >
            <Plus className="mr-2" size={20} />
            Package Intake
          </Button>
        </div>
      </div>

      {/* Intake Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Plus size={20} />
                </div>
                <div>
                  <CardTitle className="text-xl">Package Intake</CardTitle>
                  <CardDescription>Log a new package into the system</CardDescription>
                </div>
              </div>
              <button onClick={() => setShowIntakeModal(false)} className="text-muted hover:text-foreground p-1">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleIntakeSubmit}>
              <CardContent className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {intakeError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{intakeError}</p>
                  </div>
                )}

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Tracking Number</label>
                    <input
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                      required
                      placeholder="e.g. 1Z999..."
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Client Attachment</label>
                    <select 
                      name="clientId"
                      value={formData.clientId}
                      onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                      required
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all font-bold"
                    >
                      <option value="">Select client...</option>
                      {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.suiteNumber})</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-foreground">Package Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={2}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Weight (lbs)</label>
                    <input name="weight" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} type="number" className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Width</label>
                    <input name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: e.target.value})} type="number" className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Height</label>
                    <input name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} type="number" className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Length</label>
                    <input name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: e.target.value})} type="number" className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-bold" />
                  </div>
                </div>
              </CardContent>
              <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowIntakeModal(false)} className="rounded-xl font-bold">Discard</Button>
                <Button type="submit" disabled={intakeLoading} className="rounded-xl px-10 h-12 font-bold shadow-xl shadow-primary/20">
                  {intakeLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                  Complete Intake
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Verification Modal */}
      {reviewingPkg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-xl shadow-2xl border-border bg-card animate-in zoom-in-95 duration-300 overflow-hidden ring-1 ring-white/10">
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                  <FileCheck size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-display leading-tight">Invoice Verification</CardTitle>
                  <CardDescription className="font-mono text-xs mt-0.5 tracking-tight">#{reviewingPkg.trackingNumber}</CardDescription>
                </div>
              </div>
              <button onClick={() => setReviewingPkg(null)} className="text-muted hover:text-foreground p-1 transition-colors bg-muted/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="rounded-3xl border border-border bg-muted/5 p-10 flex flex-col items-center text-center group hover:bg-muted/10 transition-all border-dashed">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <FileText size={40} />
                </div>
                <h3 className="font-bold text-lg text-foreground truncate max-w-[280px] tracking-tight">
                  {reviewingPkg.invoiceUrl?.split('/').pop() || "invoice.pdf"}
                </h3>
                <p className="text-[10px] text-muted mt-3 font-bold uppercase tracking-[0.2em]">
                  Uploaded {formatDate(reviewingPkg.updatedAt)}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-8 rounded-2xl h-11 px-10 font-bold border-primary/20 text-primary hover:bg-primary/5 shadow-sm active:scale-95 transition-all"
                  onClick={() => window.open(reviewingPkg.invoiceUrl, '_blank')}
                >
                  <ExternalLink size={18} className="mr-2" />
                  View Invoice
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                  <FileText size={14} />
                  Rejection/Review Note (Optional)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Explain why this invoice needs review or was rejected..."
                  className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all min-h-[100px] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  disabled={actionLoading || !!adminNote.trim()}
                  onClick={() => handleReviewAction(reviewingPkg._id, "INVOICE_APPROVED")}
                  className={cn(
                    "h-14 rounded-2xl font-bold text-base transition-all active:scale-95",
                    !!adminNote.trim() 
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                  )}
                >
                  {actionLoading && loadingId === reviewingPkg._id ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <><CheckCircle2 className="mr-2" size={20} /> Approve</>
                  )}
                </Button>
                <Button 
                  disabled={actionLoading}
                  variant="outline" 
                  onClick={() => handleReviewAction(reviewingPkg._id, "NEEDS_REVIEW")}
                  className="h-14 rounded-2xl font-bold text-base border-rose-200 text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
                >
                  <XCircle className="mr-2" size={20} /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Master Data Table */}
      <Card className="border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-bold py-5 px-8 text-foreground uppercase text-[10px] tracking-widest">Tracking Info</TableHead>
                <TableHead className="font-bold py-5 text-foreground uppercase text-[10px] tracking-widest">Client & Suite</TableHead>
                <TableHead className="font-bold py-5 text-center text-foreground uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right font-bold py-5 px-8 text-foreground uppercase text-[10px] tracking-widest">Logistics Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-primary" size={48} />
                      <p className="text-sm font-bold text-muted uppercase tracking-widest">Updating Database...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <TableRow key={pkg._id} className="group transition-all border-border hover:bg-muted/5">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted/10 flex items-center justify-center text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <PackageIcon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground font-mono tracking-tighter">{pkg.trackingNumber}</p>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">{formatDate(pkg.receivedAt)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm leading-none">{pkg.clientId?.name || "Unknown"}</span>
                        <span className="text-[10px] text-muted font-bold tracking-widest uppercase mt-1.5">{pkg.clientId?.suiteNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("px-3 py-1 rounded-xl border font-bold text-[10px] uppercase tracking-wider shadow-sm", getStatusStyles(pkg.status))}>
                        {formatStatus(pkg.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      {pkg.status === "PENDING_INVOICE_REVIEW" && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-primary text-white hover:brightness-110 rounded-xl h-10 px-6 text-xs font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
                          onClick={() => setReviewingPkg(pkg)}
                        >
                          Verify Invoice
                        </Button>
                      )}
                      
                      {pkg.status === "SHIP_REQUESTED" && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-10 px-6 text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                          onClick={() => handleShipmentAction(pkg._id, "SHIPPED")}
                          disabled={actionLoading}
                        >
                          {actionLoading && loadingId === pkg._id ? <Loader2 className="animate-spin" size={16} /> : <><Truck className="mr-2" size={16} /> Dispatch Group</>}
                        </Button>
                      )}

                      {["READY_TO_SEND", "INVOICE_APPROVED", "SHIPPED"].includes(pkg.status) && (
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">
                          {pkg.status === "SHIPPED" ? "Done" : "Pending Client"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-32 text-center text-muted">
                    <div className="h-20 w-20 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-6">
                      <Box size={40} className="opacity-20" />
                    </div>
                    <p className="font-bold text-lg text-foreground">No Logs Found</p>
                    <p className="text-sm mt-1 font-medium">Use the "Package Intake" button to start logging.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
