"use client";

import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pendingReviews = [
  { id: "1", trk: "1Z9284109412", client: "John Doe", file: "invoice_amazon_102.pdf", date: "2026-05-09 10:15 AM" },
  { id: "2", trk: "UPS82410941", client: "Jane Smith", file: "walmart_receipt.jpg", date: "2026-05-09 09:30 AM" },
];

export default function InvoiceReview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Review Queue</h1>
        <p className="mt-2 text-slate-500">Verify client invoices to approve packages for international shipping.</p>
      </div>

      <div className="grid gap-6">
        {pendingReviews.length > 0 ? (
          pendingReviews.map((item) => (
            <Card key={item.id} className="border-none shadow-md shadow-slate-200/40 ring-1 ring-slate-100 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-500" />
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Awaiting Review</span>
                    </div>
                    <span className="text-xs text-slate-400">Uploaded {item.date}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.trk}</h3>
                      <p className="text-sm text-slate-500">Client: {item.client}</p>
                    </div>
                    
                    <div className="rounded-xl border border-blue-50 bg-blue-50/30 p-4 flex items-center justify-between group cursor-pointer hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-600 p-2 text-white shadow-md shadow-blue-100">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.file}</p>
                          <p className="text-xs text-slate-500">PDF Document • 1.2 MB</p>
                        </div>
                      </div>
                      <Eye size={20} className="text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-slate-50/50 p-6 flex flex-col justify-center gap-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100">
                    <CheckCircle2 size={18} className="mr-2" />
                    Approve Invoice
                  </Button>
                  <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300">
                    <XCircle size={18} className="mr-2" />
                    Reject / Flag
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400 mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-500">No invoices pending review at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
