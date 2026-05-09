"use client";

import { useState, useEffect } from "react";
import { 
  Package as PackageIcon, 
  Search, 
  Filter, 
  Info,
  ChevronRight,
  UploadCloud,
  Loader2,
  Box,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Save,
  Truck,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getStatusStyles, formatStatus } from "@/lib/utils";

export default function MyPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPkg, setUploadingPkg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const [consolidating, setConsolidating] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/client/packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error("Failed to fetch client packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
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

  const togglePackageSelection = (id, status) => {
    if (status !== "INVOICE_APPROVED") return;
    
    setSelectedPackageIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConsolidate = async () => {
    if (selectedPackageIds.length === 0) return;
    setConsolidating(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageIds: selectedPackageIds })
      });
      if (res.ok) {
        setSelectedPackageIds([]);
        fetchPackages();
        alert("Consolidation request submitted successfully!");
      }
    } catch (err) {
      console.error("Consolidation failed:", err);
    } finally {
      setConsolidating(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">My Packages</h1>
          <p className="mt-2 text-muted">Manage arrivals and request shipments to Aruba.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              placeholder="Search tracking #..." 
              className="h-11 w-full sm:w-64 rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
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
              <button onClick={() => setUploadingPkg(null)} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <CardContent className="p-8 text-center">
              {uploadSuccess ? (
                <div className="py-10 animate-in zoom-in duration-300">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold">Upload Received</h3>
                  <p className="text-muted mt-2">Status updated to Pending Review</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div 
                    className="rounded-3xl border-2 border-dashed border-border bg-muted/5 p-12 text-center group hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => document.getElementById('modal-file-upload').click()}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                          <FileText size={32} />
                        </div>
                        <p className="font-bold text-foreground truncate max-w-[250px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                          <FileText size={32} />
                        </div>
                        <h3 className="font-bold text-foreground text-lg">Click to select invoice</h3>
                        <p className="text-xs text-muted mt-2">PDF, JPG or PNG (Max 5MB)</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      id="modal-file-upload" 
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </div>

                  <Button 
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
                  >
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
                    Submit for Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-sm font-medium text-muted">Retrieving your shipments...</p>
          </div>
        ) : packages.length > 0 ? (
          packages.map((pkg) => {
            const isSelectable = pkg.status === "INVOICE_APPROVED";
            const isSelected = selectedPackageIds.includes(pkg._id);
            
            return (
              <Card 
                key={pkg._id} 
                className={cn(
                  "border-border bg-card transition-all shadow-sm overflow-hidden",
                  isSelectable ? "cursor-pointer hover:border-primary/40" : "opacity-80",
                  isSelected && "ring-2 ring-primary border-primary shadow-lg shadow-primary/5"
                )}
                onClick={() => togglePackageSelection(pkg._id, pkg.status)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="p-6 flex-1 flex items-center gap-5">
                      <div className="relative">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary text-white" : "bg-muted/10 text-muted"
                        )}>
                          {isSelected ? <Check size={28} /> : <PackageIcon size={28} />}
                        </div>
                        {!isSelectable && pkg.status !== "SHIP_REQUESTED" && pkg.status !== "SHIPPED" && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center">
                            <AlertCircle size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-foreground text-lg">{pkg.trackingNumber}</h3>
                          <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider", getStatusStyles(pkg.status))}>
                            {formatStatus(pkg.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted mt-1 font-medium italic">{pkg.description}</p>
                        
                        {pkg.status === "NEEDS_REVIEW" && pkg.adminNotes && (
                          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertCircle size={14} className="text-rose-600 mt-0.5 flex-none" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Rejection Note</p>
                              <p className="text-xs font-bold text-rose-700 leading-tight">{pkg.adminNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 md:pb-0 flex items-center gap-3">
                      {(pkg.status === "READY_TO_SEND" || pkg.status === "NEEDS_REVIEW") && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadingPkg(pkg);
                          }}
                          className="bg-primary hover:brightness-110 rounded-xl h-10 px-5 font-bold shadow-md"
                        >
                          <UploadCloud size={16} className="mr-2" />
                          Upload Invoice
                        </Button>
                      )}
                      
                      {pkg.status === "INVOICE_APPROVED" && (
                        <Button 
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "rounded-xl h-10 px-6 font-bold shadow-md transition-all active:scale-95",
                            isSelected ? "bg-primary text-white shadow-primary/30" : "border-primary/20 text-primary hover:bg-primary/5"
                          )}
                        >
                          {isSelected ? "Selected" : "Ready to Ship"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-3xl">
            <div className="h-24 w-24 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-6 text-muted/30">
              <Box size={48} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Locker is Empty</h3>
            <p className="text-sm text-muted mt-2 max-w-xs mx-auto">Items arriving at your US suite will be automatically logged here.</p>
          </div>
        )}
      </div>

      {/* Floating Consolidation Bar */}
      {selectedPackageIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-card/90 backdrop-blur-xl border border-primary/20 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4 ring-1 ring-white/20">
            <div className="flex items-center gap-4 pl-4">
              <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{selectedPackageIds.length} Packages Selected</p>
                <p className="text-xs text-muted font-medium">Consolidate these into a single shipment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setSelectedPackageIds([])} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={handleConsolidate}
                disabled={consolidating}
                className="rounded-2xl px-8 h-12 font-bold shadow-xl shadow-primary/30"
              >
                {consolidating ? <Loader2 className="animate-spin mr-2" /> : <Truck className="mr-2" size={18} />}
                Request Consolidation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
