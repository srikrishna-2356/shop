"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, FileText, Receipt, Truck, Home, PlusCircle, Trash2, Download, Printer, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EstimateForm from "@/components/billing/EstimateForm";
import InvoiceForm from "@/components/billing/InvoiceForm";
import EWayBillForm from "@/components/billing/EWayBillForm";

type Tab = "estimate" | "invoice" | "eway";

export default function BillingPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("estimate");

  const tabs: { key: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "estimate", label: "Estimate", icon: <FileText size={18} />, desc: "Create & share estimate" },
    { key: "invoice", label: "GST Invoice", icon: <Receipt size={18} />, desc: "GST bill with CGST/SGST" },
    { key: "eway", label: "E-Way Bill", icon: <Truck size={18} />, desc: "Generate e-way bill PDF" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))", fontFamily: "'Inter', sans-serif" }}>
      {/* ─── TOP BAR ─── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-white font-bold text-sm shadow">
                SK
              </div>
              <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sri Krishna Interior
              </span>
            </Link>
            <span className="hidden sm:block text-[hsl(var(--muted-foreground))] text-xs">/ Billing</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab pills — desktop */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === t.key
                      ? "gold-gradient text-white shadow"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={17} className="text-gold" /> : <Moon size={17} />}
            </Button>

            <Link href="/">
              <Button variant="ghost" size="icon" title="Back to Home">
                <Home size={17} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="sm:hidden flex border-t" style={{ borderColor: "hsl(var(--border))" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                activeTab === t.key ? "text-gold border-b-2 border-[hsl(var(--gold))]" : "text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "estimate" && <EstimateForm />}
        {activeTab === "invoice" && <InvoiceForm />}
        {activeTab === "eway" && <EWayBillForm />}
      </main>
    </div>
  );
}
