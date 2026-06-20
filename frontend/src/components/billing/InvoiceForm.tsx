"use client";
import { useState } from "react";
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
  state: "Tamil Nadu",
  stateCode: "33",
  bank: { bankName: "INDIAN OVERSEAS BANK", accountName: "SRI KRISHNA INTERIOR", accountNo: "390302000000088", ifsc: "IOBA0003903" },
  whatsapp: "919751888815",
  terms: "Thank you for doing business with us.",
};

interface InvoiceItem {
  id: number;
  name: string;
  hsnCode: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  gstPercent: string;
  discountPercent: string;
}

const defaultItem = (): InvoiceItem => ({
  id: Date.now(),
  name: "",
  hsnCode: "",
  quantity: "1",
  unit: "Sqf",
  pricePerUnit: "",
  gstPercent: "18",
  discountPercent: "0",
});

const UNITS = ["Sqf", "Rf", "Unit", "Kg", "Box", "Meter", "Roll", "Pair", "Set"];
const GST_OPTIONS = ["0", "5", "12", "18", "28"];

function calcItem(item: InvoiceItem) {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.pricePerUnit) || 0;
  const gst = parseFloat(item.gstPercent) || 0;
  const disc = parseFloat(item.discountPercent) || 0;
  const base = qty * price;
  const discAmt = (base * disc) / 100;
  const taxable = base - discAmt;
  const cgst = (taxable * gst) / 200;
  const sgst = (taxable * gst) / 200;
  const igst = 0;
  const total = taxable + cgst + sgst + igst;
  return { base, discAmt, taxable, cgst, sgst, igst, total };
}

function GSTInvoicePreview({ items, customer, invoiceNo, date, isInterState, bankDetails }: {
  items: InvoiceItem[];
  customer: { name: string; address: string; gstin: string; phone: string };
  invoiceNo: string;
  date: string;
  isInterState: boolean;
  bankDetails: typeof SHOP.bank;
}) {
  const subTotal = items.reduce((s, it) => s + calcItem(it).taxable, 0);
  const cgstTotal = items.reduce((s, it) => s + calcItem(it).cgst, 0);
  const sgstTotal = items.reduce((s, it) => s + calcItem(it).sgst, 0);
  const igstTotal = isInterState ? items.reduce((s, it) => s + calcItem(it).cgst + calcItem(it).sgst, 0) : 0;
  const grandTotal = subTotal + (isInterState ? igstTotal : cgstTotal + sgstTotal);

  const fmt = (n: number) => "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div id="gst-invoice-preview" className="bg-white text-gray-900 p-8 rounded-xl" style={{ fontFamily: "'Inter', sans-serif", minWidth: "640px" }}>
      {/* Header */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-amber-50 p-4 flex justify-between items-start border-b border-gray-300">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{SHOP.name}</h1>
            <p className="text-xs text-gray-600 mt-0.5">GSTIN: {SHOP.gst}</p>
            <p className="text-xs text-gray-600">Phone: {SHOP.phone}</p>
            <p className="text-xs text-gray-500 max-w-xs">{SHOP.address}</p>
            <p className="text-xs text-gray-500">State: {SHOP.state} | Code: {SHOP.stateCode}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-amber-600 uppercase tracking-wide">Tax Invoice</p>
            <p className="text-sm text-gray-700 mt-1">Invoice No: <strong>{invoiceNo}</strong></p>
            <p className="text-sm text-gray-700">Date: <strong>{date}</strong></p>
          </div>
        </div>

        {/* Customer */}
        <div className="p-4 border-b border-gray-300 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Bill To:</p>
            <p className="font-semibold text-sm">{customer.name || "—"}</p>
            <p className="text-xs text-gray-600">{customer.address}</p>
            {customer.gstin && <p className="text-xs text-gray-600">GSTIN: {customer.gstin}</p>}
            {customer.phone && <p className="text-xs text-gray-600">Ph: {customer.phone}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Supply Type:</p>
            <Badge className={isInterState ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
              {isInterState ? "Inter-State (IGST)" : "Intra-State (CGST+SGST)"}
            </Badge>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left font-semibold text-gray-700">#</th>
              <th className="p-2 text-left font-semibold text-gray-700">Description</th>
              <th className="p-2 text-left font-semibold text-gray-700">HSN</th>
              <th className="p-2 text-right font-semibold text-gray-700">Qty</th>
              <th className="p-2 text-right font-semibold text-gray-700">Rate</th>
              <th className="p-2 text-right font-semibold text-gray-700">Taxable</th>
              {!isInterState && <th className="p-2 text-right font-semibold text-gray-700">CGST</th>}
              {!isInterState && <th className="p-2 text-right font-semibold text-gray-700">SGST</th>}
              {isInterState && <th className="p-2 text-right font-semibold text-gray-700">IGST</th>}
              <th className="p-2 text-right font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const c = calcItem(item);
              return (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="p-2 text-gray-500">{idx + 1}</td>
                  <td className="p-2 font-medium">{item.name || `Item ${idx + 1}`}</td>
                  <td className="p-2 text-gray-500">{item.hsnCode || "—"}</td>
                  <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                  <td className="p-2 text-right">₹{parseFloat(item.pricePerUnit || "0").toFixed(2)}</td>
                  <td className="p-2 text-right">₹{c.taxable.toFixed(2)}</td>
                  {!isInterState && <td className="p-2 text-right">₹{c.cgst.toFixed(2)}<br /><span className="text-gray-400">{parseFloat(item.gstPercent)/2}%</span></td>}
                  {!isInterState && <td className="p-2 text-right">₹{c.sgst.toFixed(2)}<br /><span className="text-gray-400">{parseFloat(item.gstPercent)/2}%</span></td>}
                  {isInterState && <td className="p-2 text-right">₹{(c.cgst+c.sgst).toFixed(2)}<br /><span className="text-gray-400">{item.gstPercent}%</span></td>}
                  <td className="p-2 text-right font-semibold">₹{c.total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-amber-50">
              <td colSpan={5} className="p-2 font-bold text-gray-700">TOTAL</td>
              <td className="p-2 text-right font-bold">₹{subTotal.toFixed(2)}</td>
              {!isInterState && <td className="p-2 text-right font-bold">₹{cgstTotal.toFixed(2)}</td>}
              {!isInterState && <td className="p-2 text-right font-bold">₹{sgstTotal.toFixed(2)}</td>}
              {isInterState && <td className="p-2 text-right font-bold">₹{igstTotal.toFixed(2)}</td>}
              <td className="p-2 text-right font-extrabold text-amber-700">₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Bank + Signature */}
        <div className="p-4 border-t border-gray-300 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Bank Details</p>
            <p className="text-xs text-gray-700">{bankDetails.bankName}</p>
            <p className="text-xs text-gray-700">A/C: {bankDetails.accountNo}</p>
            <p className="text-xs text-gray-700">IFSC: {bankDetails.ifsc}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-6">For {SHOP.name}</p>
            <p className="text-xs text-gray-600 mt-2">Authorised Signatory</p>
          </div>
        </div>
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">Terms: {SHOP.terms}</p>
          <p className="text-xs text-gray-400 mt-1">This is a computer generated invoice. No signature required.</p>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([defaultItem()]);
  const [customer, setCustomer] = useState({ name: "", address: "", gstin: "", phone: "" });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
  const [isInterState, setIsInterState] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [bankDetails, setBankDetails] = useState(SHOP.bank);

  const addItem = () => setItems((prev) => [...prev, defaultItem()]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));
  const updateItem = (id: number, field: keyof InvoiceItem, value: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const subTotal = items.reduce((s, it) => s + calcItem(it).taxable, 0);
  const cgstTotal = items.reduce((s, it) => s + calcItem(it).cgst, 0);
  const sgstTotal = items.reduce((s, it) => s + calcItem(it).sgst, 0);
  const igstTotal = isInterState ? cgstTotal + sgstTotal : 0;
  const grandTotal = subTotal + (isInterState ? igstTotal : cgstTotal + sgstTotal);
  const fmt = (n: number) => "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  async function downloadPDF() {
    const el = document.getElementById("gst-invoice-preview");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoiceNo}.pdf`);
  }

  function handlePrint() {
    window.print();
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `*TAX INVOICE — ${SHOP.name}*\nInvoice No: ${invoiceNo} | Date: ${date}\nCustomer: ${customer.name}\n\n*Grand Total: ${fmt(grandTotal)}*\nGSTIN: ${SHOP.gst}\nPhone: ${SHOP.phone}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const inputCls = `w-full rounded-lg border px-3 py-2 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))] transition-colors`;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5 no-print print:hidden">
        {/* Header Banner */}
        <div className="rounded-2xl gold-gradient p-4 text-white flex justify-between items-center">
          <div>
            <p className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{SHOP.name}</p>
            <p className="text-xs text-white/80">GSTIN: {SHOP.gst} · {SHOP.phone}</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">GST Invoice</Badge>
        </div>

        {/* Invoice Meta */}
        <div className="rounded-2xl p-5 border space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Invoice No.</label>
              <input className={inputCls} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Date</label>
              <input type="date" className={inputCls} defaultValue={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Supply Type:</label>
            <button
              onClick={() => setIsInterState(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!isInterState ? "gold-gradient text-white border-transparent" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}
            >
              Intra-State (CGST+SGST)
            </button>
            <button
              onClick={() => setIsInterState(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isInterState ? "gold-gradient text-white border-transparent" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}
            >
              Inter-State (IGST)
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="rounded-2xl p-5 border space-y-3" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm">Customer Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Name *</label>
              <input className={inputCls} placeholder="Customer name" value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Phone</label>
              <input className={inputCls} placeholder="Mobile number" value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} />
            </div>
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

        {/* Items */}
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
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Description</label>
                      <input className={inputCls} placeholder="Product name" value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">HSN Code</label>
                      <input className={inputCls} placeholder="HSN/SAC" value={item.hsnCode}
                        onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Qty</label>
                      <input type="number" className={inputCls} value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Unit</label>
                      <select className={inputCls} value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)}>
                        {UNITS.map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Rate (₹)</label>
                      <input type="number" className={inputCls} placeholder="0.00" value={item.pricePerUnit}
                        onChange={(e) => updateItem(item.id, "pricePerUnit", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">GST %</label>
                      <select className={inputCls} value={item.gstPercent} onChange={(e) => updateItem(item.id, "gstPercent", e.target.value)}>
                        {GST_OPTIONS.map((g) => <option key={g} value={g}>{g}%</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Disc %</label>
                      <input type="number" className={inputCls} placeholder="0" value={item.discountPercent}
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
                  {/* GST Breakup */}
                  <div className="mt-3 pt-2 border-t text-xs text-[hsl(var(--muted-foreground))] flex gap-4" style={{ borderColor: "hsl(var(--border))" }}>
                    <span>Taxable: ₹{calc.taxable.toFixed(2)}</span>
                    {!isInterState && <span>CGST ({parseFloat(item.gstPercent)/2}%): ₹{calc.cgst.toFixed(2)}</span>}
                    {!isInterState && <span>SGST ({parseFloat(item.gstPercent)/2}%): ₹{calc.sgst.toFixed(2)}</span>}
                    {isInterState && <span>IGST ({item.gstPercent}%): ₹{(calc.cgst+calc.sgst).toFixed(2)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank Details Input */}
        <div className="rounded-2xl p-5 border space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm">Bank Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Bank Name</label>
              <input className={inputCls} value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Account Name</label>
              <input className={inputCls} value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Account No</label>
              <input className={inputCls} value={bankDetails.accountNo} onChange={(e) => setBankDetails({ ...bankDetails, accountNo: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">IFSC Code</label>
              <input className={inputCls} value={bankDetails.ifsc} onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-2 space-y-5 no-print print:hidden">
        <div className="rounded-2xl p-5 border sticky top-20" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm mb-3">Tax Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
              <span>Taxable Value</span><span>{fmt(subTotal)}</span>
            </div>
            {!isInterState && (
              <>
                <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                  <span>CGST</span><span>{fmt(cgstTotal)}</span>
                </div>
                <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                  <span>SGST</span><span>{fmt(sgstTotal)}</span>
                </div>
              </>
            )}
            {isInterState && (
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                <span>IGST</span><span>{fmt(igstTotal)}</span>
              </div>
            )}
            <div className="h-px my-2" style={{ background: "hsl(var(--border))" }} />
            <div className="flex justify-between font-bold text-base text-gold">
              <span>Grand Total</span><span>{fmt(grandTotal)}</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button className="w-full gold-gradient text-white font-semibold gap-2" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Hide" : "Preview Invoice"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2 border-[hsl(var(--gold)/0.5)] text-gold hover:bg-[hsl(var(--secondary))]" onClick={downloadPDF}>
                <Download size={15} /> PDF
              </Button>
              <Button variant="outline" className="gap-2 border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={shareWhatsApp}>
                <MessageCircle size={15} /> WhatsApp
              </Button>
            </div>
            <Button variant="ghost" className="w-full gap-2" onClick={handlePrint}>
              <Printer size={15} /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-5 overflow-x-auto print:block print-only print:m-0 print:p-0 ${showPreview ? "animate-fade-in block" : "absolute -left-[9999px] opacity-0"}`}>
        <div className="min-w-[700px]">
          <GSTInvoicePreview items={items} customer={customer} invoiceNo={invoiceNo} date={date} isInterState={isInterState} bankDetails={bankDetails} />
        </div>
      </div>
    </div>
  );
}
