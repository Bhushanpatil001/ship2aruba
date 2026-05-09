import Link from "next/link";
import { Ship, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      <header className="flex h-20 items-center justify-between px-6 md:px-12 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <Ship size={26} />
          </div>
          <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Ship2Aruba</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="default" className="rounded-full px-8 h-11 font-bold shadow-lg shadow-primary/20">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2 text-sm font-bold text-primary ring-1 ring-inset ring-primary/20 animate-bounce">
              <Zap size={16} />
              Fastest US-Aruba Shipping
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1]">
              Your Gateway to <br />
              <span className="text-primary underline decoration-primary/20 underline-offset-8">US Shopping</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed font-medium">
              Get a dedicated US address and ship your favorite brands directly to Aruba. 
              We handle the consolidation, customs, and final delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-5 pt-4">
              <Link href="/login">
                <Button size="lg" className="rounded-2xl px-12 h-16 text-xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                  Start Shipping Free
                  <ArrowRight className="ml-3" size={24} />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-2xl px-12 h-16 text-xl font-bold bg-card/50 backdrop-blur-sm border-border hover:bg-muted/10 transition-colors">
                How it Works
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-muted/5 border-y border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Customs Cleared", desc: "We manage all Aruba customs documentation and duty calculations for you." },
              { icon: Globe, title: "Global Brands", desc: "Shop at Amazon, eBay, Nike, and more with your own personal US suite." },
              { icon: Zap, title: "Real-time Tracking", desc: "Know exactly where your package is, from the US warehouse to your door." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-border bg-card/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Ship size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">Ship2Aruba</span>
          </div>
          <p className="text-muted text-sm font-medium">© 2026 Ship2Aruba Logistics Platform. Built for Excellence.</p>
          <div className="flex gap-6 text-sm font-bold text-muted">
            <span className="hover:text-primary cursor-pointer">Terms</span>
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
