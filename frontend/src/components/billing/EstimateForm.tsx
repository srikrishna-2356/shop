"use client";
import { useState, useRef, useCallback } from "react";
import { PlusCircle, Trash2, Download, Printer, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SHOP = {
  name: "Sri Krishna Interior",
  gst: "33CPIPP8084A1ZU",
  phone: "9751888815",
  address: "269/A, Near Indian Matriculation School, Salem Bypass, G.K Road, Harur, Dharmapuri",
  bank: {
    bankName: "INDIAN OVERSEAS BANK",
    accountName: "SRI KRISHNA INTERIOR",
    accountNo: "390302000000088",
    ifsc: "IOBA0003903",
  },
  whatsapp: "919751888815",
  terms: "Thank you for doing business with us.",
};

interface LineItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  gstPercent: string;
  discountPercent: string;
}

const defaultItem = (): LineItem => ({
  id: Date.now(),
  name: "",
  quantity: "1",
  unit: "Sqf",
  pricePerUnit: "",
  gstPercent: "0",
  discountPercent: "0",
});

const UNITS = ["Sqf", "Unit", "Kg", "Box", "Meter", "Roll", "Pair", "Set"];
const GST_OPTIONS = ["0", "5", "12", "18", "28"];

function calcItem(item: LineItem) {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.pricePerUnit) || 0;
  const gst = parseFloat(item.gstPercent) || 0;
  const disc = parseFloat(item.discountPercent) || 0;
  const base = qty * price;
  const discAmt = (base * disc) / 100;
  const taxable = base - discAmt;
  const taxAmt = (taxable * gst) / 100;
  const total = taxable + taxAmt;
  return { base, discAmt, taxable, taxAmt, total };
}

// ─── PRINT-READY INVOICE COMPONENT ─────────────────────────────────────────
function InvoicePreview({
  items,
  customer,
  estimateNo,
  date,
  type,
}: {
  items: LineItem[];
  customer: { name: string; address: string; gstin: string };
  estimateNo: string;
  date: string;
  type: "Estimate" | "Invoice";
}) {
  const subTotal = items.reduce((s, it) => s + calcItem(it).taxable, 0);
  const taxTotal = items.reduce((s, it) => s + calcItem(it).taxAmt, 0);
  const grandTotal = subTotal + taxTotal;

  return (
    <div id="invoice-preview" className="bg-white text-gray-900 p-8 rounded-xl" style={{ fontFamily: "'Inter', sans-serif", minWidth: "600px" }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{SHOP.name}</h2>
          <p className="text-sm text-gray-600">GSTIN : {SHOP.gst}</p>
          <p className="text-sm text-gray-600">{SHOP.phone}</p>
          <p className="text-xs text-gray-500 max-w-xs">{SHOP.address}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block mb-1">GENERATED ON</span>
          <div className="flex items-center gap-1 justify-end">
            <div className="w-6 h-6 rounded" style={{ background: "linear-gradient(135deg,#f5a623,#d4870a)" }} />
            <span className="font-bold text-base text-gray-800">Sri Krishna</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">{type}</h1>

      {/* Meta */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-xs text-gray-500">{type} for:</p>
          <p className="font-semibold text-sm">{customer.name || "—"}</p>
          <p className="text-xs text-gray-500 max-w-xs">{customer.address || ""}</p>
          {customer.gstin && <p className="text-xs text-gray-500">GSTIN: {customer.gstin}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{type} No.</p>
          <p className="font-bold text-lg text-gray-900">{estimateNo || "—"}</p>
          <p className="text-xs text-gray-500">Date: {date}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => {
          const calc = calcItem(item);
          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-sm mb-2" style={{ color: "#2563eb" }}>{item.name || `Item ${idx + 1}`}</p>
              <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 mb-1">
                <span>Quantity</span>
                <span>Price/Unit</span>
                <span>GST</span>
                <span>Discount</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-800">
                <span>{item.quantity} {item.unit}</span>
                <span>₹ {parseFloat(item.pricePerUnit || "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                <span>{item.gstPercent !== "0" ? `${item.gstPercent}%` : "--"}</span>
                <span>{item.discountPercent !== "0" ? `${parseFloat(item.discountPercent).toFixed(3)}%` : "--"}</span>
                <span className="text-right">₹ {calc.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakup */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-semibold text-sm text-gray-700 mb-3">Pricing / Breakup</p>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Sub Total</span>
          <span>₹ {subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        {taxTotal > 0 && (
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>GST</span>
            <span>₹ {taxTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-100" style={{ color: "#2563eb" }}>
          <span>Total Amount</span>
          <span>₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Bank + Signature */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-xs text-gray-700 mb-2">Bank Details</p>
          <p className="text-xs text-gray-600">{SHOP.bank.bankName}</p>
          <p className="text-xs text-gray-600">{SHOP.bank.accountName}</p>
          <p className="text-xs text-gray-600">Account No: {SHOP.bank.accountNo}</p>
          <p className="text-xs text-gray-600">IFSC Code: {SHOP.bank.ifsc}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-12 border border-gray-200 rounded mb-2 flex items-center justify-center text-gray-400 text-xs">
            Signature
          </div>
          <p className="text-xs text-gray-600">{SHOP.name}</p>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 mt-4">Terms & Conditions : {SHOP.terms}</p>
    </div>
  );
}

// ─── MAIN ESTIMATE FORM ─────────────────────────────────────────────────────
export default function EstimateForm() {
  const [items, setItems] = useState<LineItem[]>([defaultItem()]);
  const [customer, setCustomer] = useState({ name: "", address: "", gstin: "" });
  const [estimateNo, setEstimateNo] = useState("1");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
  const [notes, setNotes] = useState(SHOP.terms);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () => setItems((prev) => [...prev, defaultItem()]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));
  const updateItem = (id: number, field: keyof LineItem, value: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const subTotal = items.reduce((s, it) => s + calcItem(it).taxable, 0);
  const taxTotal = items.reduce((s, it) => s + calcItem(it).taxAmt, 0);
  const grandTotal = subTotal + taxTotal;

  const fmt = (n: number) =>
    "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  async function downloadPDF() {
    if (!showPreview) {
      setShowPreview(true);
      setTimeout(downloadPDF, 300);
      return;
    }
    const el = document.getElementById("invoice-preview");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Estimate-${estimateNo}-${customer.name || "Customer"}.pdf`);
  }

  function handlePrint() {
    if (!showPreview) {
      setShowPreview(true);
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  }

  async function shareOnWhatsApp() {
    const text = encodeURIComponent(
      `*${SHOP.name} — Estimate #${estimateNo}*\n` +
      `Date: ${date}\n` +
      `Customer: ${customer.name}\n\n` +
      items.map((it) => `• ${it.name}: ${it.quantity} ${it.unit} × ₹${it.pricePerUnit} = ₹${calcItem(it).total.toFixed(2)}`).join("\n") +
      `\n\n*Grand Total: ${fmt(grandTotal)}*\n\n` +
      `GSTIN: ${SHOP.gst}\n${SHOP.phone}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const inputCls = `w-full rounded-lg border px-3 py-2 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))] transition-colors`;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* ─── LEFT: FORM ─── */}
      <div className="lg:col-span-3 space-y-5 no-print print:hidden">
        {/* Shop Info Banner */}
        <div className="rounded-2xl gold-gradient p-4 text-white">
          <p className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{SHOP.name}</p>
          <p className="text-xs text-white/80">GSTIN: {SHOP.gst} · {SHOP.phone}</p>
          <p className="text-xs text-white/70 mt-0.5">{SHOP.address}</p>
        </div>

        {/* Estimate Meta */}
        <div className="rounded-2xl p-5 border space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Estimate Details</h3>
            <Badge variant="outline" className="text-gold border-[hsl(var(--gold)/0.4)]">Draft</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Estimate No.</label>
              <input className={inputCls} value={estimateNo} onChange={(e) => setEstimateNo(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Date</label>
              <input type="date" className={inputCls} value={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }))} />
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="rounded-2xl p-5 border space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm">Customer Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Customer Name *</label>
              <input className={inputCls} placeholder="e.g. Subramaniya Siva Co." value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Address</label>
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Customer address"
                value={customer.address} onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">GSTIN (optional)</label>
              <input className={inputCls} placeholder="Customer GSTIN" value={customer.gstin}
                onChange={(e) => setCustomer((c) => ({ ...c, gstin: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-2xl p-5 border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Products / Services</h3>
            <Button size="sm" onClick={addItem} className="gold-gradient text-white gap-1.5">
              <PlusCircle size={15} /> Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const calc = calcItem(item);
              return (
                <div key={item.id} className="invoice-item-row rounded-xl p-4 border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-gold">Item {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Product / Service Name</label>
                    <input className={inputCls} placeholder="e.g. Aluminium Partition" value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                  </div>

                  {/* Qty / Unit / Price */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Qty</label>
                      <input type="number" className={inputCls} min="0" value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Unit</label>
                      <select className={inputCls} value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)}>
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Price/Unit (₹)</label>
                      <input type="number" className={inputCls} min="0" placeholder="0.00" value={item.pricePerUnit}
                        onChange={(e) => updateItem(item.id, "pricePerUnit", e.target.value)} />
                    </div>
                  </div>

                  {/* GST / Discount / Amount */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">GST %</label>
                      <select className={inputCls} value={item.gstPercent} onChange={(e) => updateItem(item.id, "gstPercent", e.target.value)}>
                        {GST_OPTIONS.map((g) => <option key={g} value={g}>{g}%</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Discount %</label>
                      <input type="number" className={inputCls} min="0" max="100" placeholder="0" value={item.discountPercent}
                        onChange={(e) => updateItem(item.id, "discountPercent", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Amount</label>
                      <div className="w-full rounded-lg border px-3 py-2 text-sm font-semibold text-gold"
                        style={{ background: "hsl(var(--secondary))", borderColor: "hsl(var(--border))" }}>
                        {fmt(calc.total)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl p-5 border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-2">Terms & Conditions</label>
          <textarea className={`${inputCls} resize-none`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      {/* ─── RIGHT: SUMMARY + PREVIEW ─── */}
      <div className="lg:col-span-2 space-y-5 no-print print:hidden">
        {/* Totals */}
        <div className="rounded-2xl p-5 border space-y-3 sticky top-20" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm mb-2">Pricing Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
              <span>Sub Total</span><span>{fmt(subTotal)}</span>
            </div>
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
              <span>Total GST</span><span>{fmt(taxTotal)}</span>
            </div>
            <div className="h-px my-2" style={{ background: "hsl(var(--border))" }} />
            <div className="flex justify-between font-bold text-base text-gold">
              <span>Grand Total</span><span>{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <Button
              className="w-full gold-gradient text-white font-semibold gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Hide Preview" : "Preview Estimate"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2 border-[hsl(var(--gold)/0.5)] text-gold hover:bg-[hsl(var(--secondary))]" onClick={downloadPDF}>
                <Download size={15} /> PDF
              </Button>
              <Button variant="outline" className="gap-2 border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={shareOnWhatsApp}>
                <MessageCircle size={15} /> WhatsApp
              </Button>
            </div>
            <Button variant="ghost" className="w-full gap-2" onClick={handlePrint}>
              <Printer size={15} /> Print
            </Button>
          </div>
        </div>

        {/* Bank Details card */}
        <div className="rounded-2xl p-4 border text-sm" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <p className="font-semibold text-xs text-[hsl(var(--muted-foreground))] mb-2">BANK DETAILS</p>
          <p className="font-medium">{SHOP.bank.bankName}</p>
          <p className="text-[hsl(var(--muted-foreground))] text-xs">{SHOP.bank.accountName}</p>
          <p className="text-[hsl(var(--muted-foreground))] text-xs">A/C: {SHOP.bank.accountNo}</p>
          <p className="text-[hsl(var(--muted-foreground))] text-xs">IFSC: {SHOP.bank.ifsc}</p>
        </div>
      </div>

      {/* ─── PREVIEW PANEL (Full Width) ─── */}
      {showPreview && (
        <div className="lg:col-span-5 overflow-x-auto animate-fade-in print:block print-only print:m-0 print:p-0">
          <div className="min-w-[640px]" ref={previewRef}>
            <InvoicePreview
              items={items}
              customer={customer}
              estimateNo={estimateNo}
              date={date}
              type="Estimate"
            />
          </div>
        </div>
      )}
    </div>
  );
}
