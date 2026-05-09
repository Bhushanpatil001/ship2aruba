"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Scale, 
  Maximize2, 
  User as UserIcon, 
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PackageIntake() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    trackingNumber: "",
    clientId: "",
    description: "",
    width: "",
    height: "",
    length: "",
    weight: ""
  });

  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        if (active) setClients(data.clients || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };
    fetchClients();
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId) return setError("Please select a client");
    
    setLoading(true);
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
        setSubmitted(true);
        setFormData({
          trackingNumber: "",
          clientId: "",
          description: "",
          width: "",
          height: "",
          length: "",
          weight: ""
        });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to log package");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-6 text-emerald-600 mb-6">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Package Logged Successfully!</h2>
        <p className="text-muted mt-2">The client has been notified of the arrival.</p>
        <Button 
          variant="outline" 
          className="mt-8 rounded-xl"
          onClick={() => setSubmitted(false)}
        >
          Log Another Package
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Package Intake</h1>
        <p className="mt-2 text-muted">Record incoming shipments from the US warehouse.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Box size={20} />
              <CardTitle className="text-lg">Package Identity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Tracking Number</label>
              <input
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                required
                placeholder="e.g. 1Z999AA10123456784"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Client / Customer</label>
              <select 
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
              >
                <option value="">Select a client...</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name} ({client.suiteNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Contents Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Brief description of items inside..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Maximize2 size={20} />
              <CardTitle className="text-lg">Dimensions & Weight</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Width (in)</label>
                <input name="width" value={formData.width} onChange={handleChange} type="number" step="0.1" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Height (in)</label>
                <input name="height" value={formData.height} onChange={handleChange} type="number" step="0.1" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Length (in)</label>
                <input name="length" value={formData.length} onChange={handleChange} type="number" step="0.1" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Weight (lbs)</label>
                <input name="weight" value={formData.weight} onChange={handleChange} type="number" step="0.1" className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button variant="ghost" type="button" onClick={() => window.history.back()}>Cancel</Button>
          <Button type="submit" disabled={loading} className="px-8 rounded-xl h-12 shadow-lg shadow-primary/20">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Log Package
          </Button>
        </div>
      </form>
    </div>
  );
}
