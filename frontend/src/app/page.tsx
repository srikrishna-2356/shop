"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Phone, MessageCircle, MapPin, Award, ChevronRight, Star, BarChart3, FileText, Package, Users, Zap, Shield, Printer, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SHOP = {
  name: "Sri Krishna Interior",
  tagline: "Premium Interior Solutions & Billing Management",
  gst: "33CPIPP8084A1ZU",
  phone: "9751888815",
  address: "269/A, Near Indian Matriculation School, Salem Bypass, G.K Road, Harur, Dharmapuri",
  whatsapp: "919751888815",
};

const categories = [
  { name: "Aluminium Partitions", icon: "🏢", desc: "Modern office & home partitions" },
  { name: "Door Closers & Hardware", icon: "🚪", desc: "Premium door accessories" },
  { name: "Glass Works", icon: "✨", desc: "Toughened & decorative glass" },
  { name: "False Ceiling", icon: "🏠", desc: "POP & gypsum ceiling solutions" },
  { name: "Wall Cladding", icon: "🧱", desc: "ACP & HPL wall panels" },
  { name: "Flooring Solutions", icon: "🔲", desc: "Tiles, vinyl & wood flooring" },
];

const features = [
  { icon: <FileText size={24} />, title: "Estimate Generation", desc: "Create professional Vyapar-style estimates instantly with GST breakdowns" },
  { icon: <BarChart3 size={24} />, title: "GST Billing", desc: "CGST/SGST/IGST split invoices with QR code payment & PDF export" },
  { icon: <Package size={24} />, title: "Inventory Control", desc: "Track stock with low-stock alerts and category management" },
  { icon: <Users size={24} />, title: "Customer Ledger", desc: "Full customer history, pending payments, and due reminders" },
  { icon: <Zap size={24} />, title: "E-Way Bills", desc: "Auto-generate e-way bills linked to invoices with PDF/JSON export" },
  { icon: <Shield size={24} />, title: "Secure & Multi-User", desc: "Role-based access with audit logs and JWT authentication" },
];

const testimonials = [
  { name: "Rajesh Kumar", company: "Gopala Puram Co-op", rating: 5, text: "Excellent aluminum partition work. Delivered on time with professional finish!" },
  { name: "Subramaniya Siva", company: "Sugar Mills Ltd.", rating: 5, text: "Very happy with the glass work. The estimate was clear and billing was transparent." },
  { name: "Murugan S.", company: "Home Owner, Salem", rating: 5, text: "Best interior shop in Harur. Quality products and honest pricing!" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} fill="hsl(43,90%,48%)" className="text-gold" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center text-white font-bold text-lg shadow">
                SK
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-sm leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Sri Krishna
                </p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Interior</p>
              </div>
            </Link>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {["Products", "Services", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium transition-colors hover:text-[hsl(var(--gold))]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:bg-[hsl(var(--secondary))]"
                >
                  {theme === "dark" ? <Sun size={18} className="text-gold" /> : <Moon size={18} />}
                </Button>
              )}
              <Link href="/billing" className="hidden sm:block">
                <Button className="gold-gradient text-white font-semibold shadow hover:opacity-90 transition-opacity">
                  <FileText size={16} className="mr-2" /> Open Billing
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            {["Products", "Services", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium py-1 hover:text-[hsl(var(--gold))]"
              >
                {item}
              </a>
            ))}
            <Link href="/billing" onClick={() => setMenuOpen(false)}>
              <Button className="w-full gold-gradient text-white font-semibold mt-2">
                <FileText size={16} className="mr-2" /> Open Billing
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section className="hero-bg pt-28 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm animate-fade-in">
            GST Registered · GSTIN: {SHOP.gst}
          </Badge>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {SHOP.name}
          </h1>
          <p className="text-xl text-white/85 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
            {SHOP.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-200">
            <Link href="/billing">
              <Button size="lg" className="bg-white text-[hsl(43,80%,35%)] hover:bg-white/90 font-bold shadow-xl px-8">
                <FileText size={18} className="mr-2" /> Create Estimate / Bill
              </Button>
            </Link>
            <a
              href={`https://wa.me/${SHOP.whatsapp}?text=Hi, I'd like to get an estimate from Sri Krishna Interior.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                <MessageCircle size={18} className="mr-2" /> WhatsApp Us
              </Button>
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up delay-300">
            {[
              { val: "500+", label: "Happy Clients" },
              { val: "1200+", label: "Projects Done" },
              { val: "12+", label: "Years Experience" },
              { val: "GST", label: "Certified Shop" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-4 text-white">
                <div className="text-2xl font-bold text-yellow-300">{s.val}</div>
                <div className="text-xs text-white/75 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section id="products" className="py-20 px-4" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-[hsl(var(--secondary))] text-gold border-[hsl(var(--gold)/0.3)]">Our Products</Badge>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Interior Solutions</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Premium materials and expert craftsmanship for every space</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className="stat-card rounded-2xl cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-[hsl(var(--gold))] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{cat.desc}</p>
                <div className="mt-4 flex items-center text-xs font-medium text-gold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Products <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES (Billing System) ─── */}
      <section id="services" className="py-20 px-4" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-[hsl(var(--secondary))] text-gold border-[hsl(var(--gold)/0.3)]">Platform Features</Badge>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Vyapar-Inspired Billing
            </h2>
            <p className="text-[hsl(var(--muted-foreground))]">Everything you need to run your interior business professionally</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="stat-card rounded-2xl animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-white mb-4 shadow">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-12 rounded-3xl gold-gradient p-8 text-white text-center shadow-xl">
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to create your first estimate?
            </h3>
            <p className="text-white/80 mb-6">Generate, print and share professional estimates & bills in seconds</p>
            <div className="flex gap-3 justify-center">
              <Link href="/billing">
                <Button size="lg" className="bg-white text-[hsl(43,80%,35%)] hover:bg-white/90 font-bold">
                  <Printer size={16} className="mr-2" /> Open Billing System
                </Button>
              </Link>
              <Link href="/billing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/15 font-semibold">
                  <Download size={16} className="mr-2" /> View Demo Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 px-4" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-[hsl(var(--secondary))] text-gold border-[hsl(var(--gold)/0.3)]">Reviews</Badge>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="stat-card rounded-2xl animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <StarRating rating={t.rating} />
                <p className="text-sm leading-relaxed my-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gold">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 px-4" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-3 bg-[hsl(var(--secondary))] text-gold border-[hsl(var(--gold)/0.3)]">Contact Us</Badge>
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Phone size={22} className="text-gold" />,
                label: "Call / WhatsApp",
                value: SHOP.phone,
                href: `tel:${SHOP.phone}`,
              },
              {
                icon: <MessageCircle size={22} className="text-gold" />,
                label: "WhatsApp",
                value: "Chat Now",
                href: `https://wa.me/${SHOP.whatsapp}`,
              },
              {
                icon: <MapPin size={22} className="text-gold" />,
                label: "Address",
                value: "Harur, Dharmapuri",
                href: "https://maps.google.com",
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="stat-card rounded-2xl flex flex-col items-center gap-2 p-5 hover:border-[hsl(var(--gold))] transition-all"
              >
                {c.icon}
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{c.label}</p>
                <p className="font-semibold text-sm">{c.value}</p>
              </a>
            ))}
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{SHOP.address}</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t py-8 px-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-white font-bold text-sm">
              SK
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{SHOP.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">GSTIN: {SHOP.gst}</p>
            </div>
          </div>
          <div className="text-center text-xs text-[hsl(var(--muted-foreground))]">
            <p>© 2026 Sri Krishna Interior. All rights reserved.</p>
            <p className="mt-0.5">269/A, Salem Bypass, G.K Road, Harur, Dharmapuri — {SHOP.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${SHOP.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gold-gradient text-white font-medium">
                <MessageCircle size={14} className="mr-1.5" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${SHOP.whatsapp}?text=Hi Sri Krishna Interior, I need a quote.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center no-print"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
