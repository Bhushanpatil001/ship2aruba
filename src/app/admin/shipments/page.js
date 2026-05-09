"use client";

import { useState, useEffect } from "react";
import { Ship, Clock, CheckCircle2, Truck, ExternalLink, Loader2, Package as PackageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      setShipments(data.shipments || []);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      await fetchShipments();
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleShip = async (id) => {
    try {
      const res = await fetch("/api/shipments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          status: "SHIPPED"
        }),
      });
      if (res.ok) fetchShipments();
    } catch (err) {
      console.error("Failed to ship:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Consolidation Requests</h1>
        <p className="mt-2 text-muted">Manage and dispatch shipments to Aruba.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-sm font-medium text-muted">Loading logistics queue...</p>
        </div>
      ) : shipments.length > 0 ? (
        <div className="grid gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment._id} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Truck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-foreground">Shipment #{shipment._id.slice(-6).toUpperCase()}</h3>
                        <Badge variant={shipment.status === "SHIPPED" ? "success" : "blue"}>
                          {shipment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted mt-1">
                        Client: <span className="font-bold text-foreground">{shipment.clientId?.name}</span> ({shipment.clientId?.suiteNumber})
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex -space-x-2">
                          {shipment.packageIds.map((pkg, i) => (
                            <div key={pkg._id} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center" title={pkg.description}>
                              <PackageIcon size={14} className="text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-muted font-medium">{shipment.packageIds.length} Packages</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {shipment.status === "PENDING" && (
                      <Button 
                        onClick={() => handleShip(shipment._id)}
                        className="bg-primary hover:brightness-110 shadow-lg shadow-primary/20 rounded-xl"
                      >
                        <Ship size={18} className="mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {shipment.status === "SHIPPED" && (
                      <div className="text-right">
                        <p className="text-xs font-bold text-muted uppercase tracking-tighter">Tracking Number</p>
                        <p className="text-sm font-mono font-bold text-foreground">{shipment.trackingNumber}</p>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="text-muted">
                      <ExternalLink size={20} />
                    </Button>
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
              <Ship size={64} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">No Shipments Pending</h2>
            <p className="text-muted mt-2 max-w-sm mx-auto">
              When clients consolidate their approved packages, they will appear here for processing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
