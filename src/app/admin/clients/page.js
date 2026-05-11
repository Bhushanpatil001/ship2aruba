"use client";

import { useState, useEffect } from "react";
import { Users, Search, Loader2, UserPlus, Mail, Hash, Package, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "client123" // Default password for ease
  });

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setClients([data.client, ...clients]);
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "client123" });
      } else {
        setError(data.error || "Failed to add client");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.suiteNumber?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md shadow-2xl border-border bg-card animate-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Register New Client</CardTitle>
              <CardDescription>Manually add a client and assign a US suite number.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddClient}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-bold">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Suite Number (Optional)</label>
                  <input 
                    value={formData.suiteNumber}
                    onChange={(e) => setFormData({...formData, suiteNumber: e.target.value})}
                    className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none transition-all font-mono"
                    placeholder="e.g. S2A-1006 (Auto-generated if empty)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Default Password</label>
                  <input 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none transition-all font-mono"
                  />
                </div>
              </CardContent>
              <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)} disabled={addLoading}>Cancel</Button>
                <Button type="submit" disabled={addLoading} className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  {addLoading ? <Loader2 className="animate-spin" size={20} /> : "Register Client"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Registered Clients</h1>
          <p className="mt-2 text-muted">Manage your customer base and their associated US suite numbers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full sm:w-64 rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="rounded-xl h-11 px-5 shadow-lg shadow-primary/20">
            <UserPlus size={18} className="mr-2" />
            New Client
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card shadow-lg shadow-primary/5 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-sm font-medium text-muted">Retrieving client directory...</p>
          </div>
        ) : filteredClients.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-bold py-4">Client Information</TableHead>
                <TableHead className="font-bold py-4 text-center">Suite Number</TableHead>
                <TableHead className="font-bold py-4 text-center">Status</TableHead>
                <TableHead className="font-bold py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client._id} className="border-border hover:bg-muted/5 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {client.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-none">{client.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                          <Mail size={12} />
                          {client.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-lg border border-border">
                      <Hash size={14} className="text-primary" />
                      <span className="font-mono text-sm font-bold text-foreground">
                        {client.suiteNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="View Packages"
                        className="text-muted group-hover:text-primary transition-colors"
                        onClick={() => window.location.href = `/admin/packages?client=${client._id}`}
                      >
                        <ExternalLink size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-24 text-center">
            <div className="h-20 w-20 rounded-full bg-muted/10 flex items-center justify-center mx-auto mb-6 text-muted/30">
              <Users size={40} />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Clients Found</h3>
            <p className="text-sm text-muted mt-2 max-w-xs mx-auto">
              {search ? "No matches for your search query." : "You haven't added any clients to the platform yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
