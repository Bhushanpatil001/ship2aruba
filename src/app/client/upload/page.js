"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UploadCloud, FileText, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function UploadInvoiceContent() {
  const searchParams = useSearchParams();
  const trackingFromUrl = searchParams.get("tracking");
  
  const [packages, setPackages] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(trackingFromUrl || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchAvailable = async () => {
      try {
        const res = await fetch("/api/client/packages");
        const data = await res.json();
        const actionNeeded = (data.packages || []).filter(p => 
          ["READY_TO_SEND", "NEEDS_REVIEW"].includes(p.status)
        );
        if (active) setPackages(actionNeeded);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAvailable();
    return () => { active = false; };
  }, []);

  const handleUpload = async () => {
    if (!selectedPkg) return;
    setUploading(true);
    try {
      const res = await fetch("/api/client/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          trackingNumber: selectedPkg,
          invoiceUrl: "/invoices/sample.pdf" // Simulation
        })
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Upload Complete!</h2>
        <p className="text-muted mt-2 max-w-sm">Our team will now review your invoice for customs clearance.</p>
        <Button className="mt-8 rounded-xl" onClick={() => window.location.href = "/client/dashboard"}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Invoice</h1>
        <p className="mt-2 text-muted">Submit your purchase documentation for customs clearance.</p>
      </div>

      <Card className="border-border bg-card shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Select Package</CardTitle>
          <CardDescription>Choose the package this invoice belongs to.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <select 
            value={selectedPkg}
            onChange={(e) => setSelectedPkg(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
          >
            <option value="">Choose a package...</option>
            {packages.map(p => (
              <option key={p._id} value={p.trackingNumber}>
                {p.description} ({p.trackingNumber})
              </option>
            ))}
          </select>

          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/5 p-12 text-center group hover:border-primary/50 transition-colors">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Drop invoice here</h3>
            <p className="text-sm text-muted mt-1">or click to browse from your device</p>
            <input type="file" className="hidden" id="file-upload" />
            <Button 
              className="mt-6 rounded-xl" 
              variant="outline" 
              onClick={() => document.getElementById('file-upload').click()}
            >
              Browse Files
            </Button>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted mt-6">PDF, JPG, PNG • MAX 5MB</p>
          </div>

          <Button 
            onClick={handleUpload}
            disabled={!selectedPkg || uploading}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
          >
            {uploading ? <Loader2 className="animate-spin mr-2" /> : <UploadCloud className="mr-2" />}
            Confirm & Upload
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10 flex gap-4">
        <div className="text-primary shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-foreground">Customs Requirement</h4>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Aruba Customs requires a commercial invoice to verify item values and calculate import duties.
            Packages without valid documentation will be held at the warehouse.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UploadInvoicePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <UploadInvoiceContent />
    </Suspense>
  );
}
