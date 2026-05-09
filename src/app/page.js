import Link from "next/link";
import { Ship, ArrowRight, ShieldCheck, Zap, Globe, Package, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      {/* Premium Navigation */}
      <header className="flex h-20 items-center justify-between px-6 md:px-12 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Ship size={26} />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] animate-gradient">Ship2Aruba</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="default" className="rounded-2xl px-8 h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Portal Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section: High Impact */}
        <section className="relative py-24 md:py-40 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-50">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/20 animate-in fade-in slide-in-from-top-4 duration-1000">
              <Zap size={14} className="fill-primary" />
              Direct US to Aruba Forwarding
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] animate-in fade-in zoom-in-95 duration-1000">
              Shop the US <br />
              <span className="text-primary italic">Live in Aruba.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Your premium logistics partner. Get a dedicated US suite, consolidate your packages, and enjoy seamless delivery directly to your doorstep in Aruba.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link href="/login">
                <Button size="lg" className="rounded-2xl px-12 h-16 text-xl font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
                  Start Shipping
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-2xl px-12 h-16 text-xl font-black bg-muted/5 border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all dark:bg-white/5 dark:hover:bg-white/10"
              >
                How it Works
              </Button>
            </div>

            {/* Trusted Brands / Partners Placeholder */}
            <div className="pt-16 opacity-40 grayscale flex flex-wrap justify-center gap-12 items-center">
              <span className="font-black text-2xl tracking-tighter uppercase italic">Amazon</span>
              <span className="font-black text-2xl tracking-tighter uppercase italic">eBay</span>
              <span className="font-black text-2xl tracking-tighter uppercase italic">Walmart</span>
              <span className="font-black text-2xl tracking-tighter uppercase italic">Nike</span>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 px-6 bg-muted/5 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Three Steps to Freedom</h2>
              <p className="text-muted font-bold uppercase tracking-widest text-sm">Simplifying your global shopping experience</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { 
                  icon: Package, 
                  step: "01", 
                  title: "Get Your Address", 
                  desc: "Sign up instantly and receive your unique US suite address at our Florida warehouse." 
                },
                { 
                  icon: ShieldCheck, 
                  step: "02", 
                  title: "Shop & Ship", 
                  desc: "Shop at any US store and ship to your new address. We'll verify and prepare everything." 
                },
                { 
                  icon: Ship, 
                  step: "03", 
                  title: "Aruba Delivery", 
                  desc: "We consolidate your items and handle customs. Your package arrives safely in Aruba." 
                }
              ].map((f, i) => (
                <div key={i} className="relative p-10 rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-muted/5 group-hover:text-primary/5 transition-colors leading-none">{f.step}</div>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <f.icon size={36} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-muted leading-relaxed font-medium pr-8">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
                Unmatched <br />
                Logistics <br />
                <span className="text-primary">Intelligence.</span>
              </h2>
              <p className="text-xl text-muted font-medium leading-relaxed">
                We've spent years perfecting the US-Aruba route. Our technology ensures your packages are handled with care and delivered with speed.
              </p>
              <ul className="space-y-4">
                {["Automated Customs Processing", "High-Volume Consolidation", "Secure Warehouse Storage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-bold text-lg">
                    <CheckCircle2 size={24} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">
                Explore Our Technology
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-primary/10 flex items-center justify-center overflow-hidden">
                 <Ship size={200} className="text-primary/20 animate-pulse" />
              </div>
              {/* Floating Card UI Mockup */}
              <div className="absolute -bottom-8 -left-8 w-64 p-6 rounded-3xl border border-border bg-card shadow-2xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted">Real-time status</p>
                </div>
                <p className="text-lg font-bold">In Transit to Aruba</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-border bg-card/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                <Ship size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter">Ship2Aruba</span>
            </div>
            <p className="text-muted font-medium max-w-sm">
              The premier logistics solution for Aruban residents shopping in the United States. Fast, secure, and reliable.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-muted">Platform</h4>
            <ul className="space-y-2 font-bold text-sm">
              <li className="hover:text-primary transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Prohibited Items</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Delivery Areas</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-muted">Support</h4>
            <ul className="space-y-2 font-bold text-sm">
              <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Live Chat</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs font-bold uppercase tracking-tighter">© 2026 Ship2Aruba Logistics Platform. All Rights Reserved.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
