"use client";
import { useState } from "react";
import { Truck, Download, FileJson, MessageCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SHOP = {
  name: "Sri Krishna Interior",
  gst: "33CPIPP8084A1ZU",
  phone: "9751888815",
  address: "269/A, Near Indian Matriculation School, Salem Bypass, G.K Road, Harur, Dharmapuri",
};

interface HsnItem {
  id: number;
  description: string;
  hsnCode: string;
  quantity: string;
  unit: string;
  taxableValue: string;
  taxRate: string;
}

const defaultHsnItem = (): HsnItem => ({
  id: Date.now(),
  description: "",
  hsnCode: "",
  quantity: "1",
  unit: "Sqf",
  taxableValue: "",
  taxRate: "18",
});

const UNITS = ["Sqf", "Rf", "Unit", "Kg", "Box", "Meter", "Roll", "Pair", "Set"];

function EWayBillPreview({ form, items }: { form: any; items: HsnItem[] }) {
  const totalTaxable = items.reduce((s, it) => s + (parseFloat(it.taxableValue) || 0), 0);
  const totalTax = items.reduce((s, it) => {
    const val = parseFloat(it.taxableValue) || 0;
    const rate = parseFloat(it.taxRate) || 0;
    return s + (val * rate) / 100;
  }, 0);

  return (
    <div id="eway-preview" className="bg-white text-gray-900 p-8 rounded-xl" style={{ fontFamily: "'Inter', sans-serif", minWidth: "640px" }}>
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
        {/* Title */}
        <div className="bg-blue-700 text-white p-3 flex justify-between items-center">
          <div>
            <h1 className="font-extrabold text-lg uppercase tracking-wide">E-Way Bill</h1>
            <p className="text-xs text-blue-200">Generated for: {SHOP.name} | GSTIN: {SHOP.gst}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">E-Way Bill No.</p>
            <p className="font-bold">{form.eWayBillNo || "EWB-XXXXXXXXXX"}</p>
            <p className="text-xs text-blue-200">Date: {form.date}</p>
          </div>
        </div>

        {/* Part A */}
        <div className="p-4 border-b border-gray-300">
          <p className="font-bold text-xs text-blue-700 uppercase mb-3 tracking-wide">PART A — Invoice Details</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            <div><span className="text-gray-500">Invoice No:</span> <strong>{form.invoiceNo}</strong></div>
            <div><span className="text-gray-500">Invoice Date:</span> <strong>{form.invoiceDate}</strong></div>
            <div><span className="text-gray-500">Invoice Value:</span> <strong>₹ {(totalTaxable + totalTax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
            <div><span className="text-gray-500">Supply Type:</span> <strong>{form.supplyType}</strong></div>
          </div>
        </div>

        {/* Consignor / Consignee */}
        <div className="p-4 border-b border-gray-300 grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-xs text-blue-700 uppercase mb-2">From (Consignor)</p>
            <p className="text-xs font-semibold">{SHOP.name}</p>
            <p className="text-xs text-gray-600">GSTIN: {SHOP.gst}</p>
            <p className="text-xs text-gray-600 max-w-xs">{SHOP.address}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-blue-700 uppercase mb-2">To (Consignee)</p>
            <p className="text-xs font-semibold">{form.consigneeName || "—"}</p>
            <p className="text-xs text-gray-600">{form.consigneeGstin && `GSTIN: ${form.consigneeGstin}`}</p>
            <p className="text-xs text-gray-600 max-w-xs">{form.deliveryAddress || "—"}</p>
          </div>
        </div>

        {/* HSN Table */}
        <table className="w-full text-xs border-b border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left font-semibold text-gray-700">Description</th>
              <th className="p-2 text-left font-semibold text-gray-700">HSN</th>
              <th className="p-2 text-right font-semibold text-gray-700">Qty</th>
              <th className="p-2 text-right font-semibold text-gray-700">Taxable Value</th>
              <th className="p-2 text-right font-semibold text-gray-700">Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id} className="border-t border-gray-200">
                <td className="p-2">{it.description || `Item ${idx + 1}`}</td>
                <td className="p-2 text-gray-600">{it.hsnCode || "—"}</td>
                <td className="p-2 text-right">{it.quantity} {it.unit}</td>
                <td className="p-2 text-right">₹ {parseFloat(it.taxableValue || "0").toFixed(2)}</td>
                <td className="p-2 text-right">{it.taxRate}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-400 bg-blue-50 font-bold">
              <td colSpan={3} className="p-2">TOTAL</td>
              <td className="p-2 text-right">₹ {totalTaxable.toFixed(2)}</td>
              <td className="p-2 text-right">₹ {totalTax.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Part B */}
        <div className="p-4">
          <p className="font-bold text-xs text-blue-700 uppercase mb-3 tracking-wide">PART B — Transport Details</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-xs">
            <div><span className="text-gray-500">Transporter Name:</span> <strong>{form.transporterName || "—"}</strong></div>
            <div><span className="text-gray-500">Transporter ID:</span> <strong>{form.transporterId || "—"}</strong></div>
            <div><span className="text-gray-500">Vehicle No:</span> <strong>{form.vehicleNumber || "—"}</strong></div>
            <div><span className="text-gray-500">Mode:</span> <strong>{form.transportMode}</strong></div>
            <div><span className="text-gray-500">Distance:</span> <strong>{form.distance} km</strong></div>
            <div><span className="text-gray-500">Weight:</span> <strong>{form.weight} kg</strong></div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">This E-Way Bill is generated as per GST rules. Valid for transport within India.</p>
        </div>
      </div>
    </div>
  );
}

export default function EWayBillForm() {
  const [form, setForm] = useState({
    eWayBillNo: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    supplyType: "Outward",
    consigneeName: "",
    consigneeGstin: "",
    deliveryAddress: "",
    transporterName: "",
    transporterId: "",
    vehicleNumber: "",
    transportMode: "Road",
    distance: "",
    weight: "",
  });
  const [items, setItems] = useState<HsnItem[]>([defaultHsnItem()]);
  const [showPreview, setShowPreview] = useState(false);

  const setField = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const addItem = () => setItems((prev) => [...prev, defaultHsnItem()]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));
  const updateItem = (id: number, field: keyof HsnItem, value: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const totalTaxable = items.reduce((s, it) => s + (parseFloat(it.taxableValue) || 0), 0);
  const totalTax = items.reduce((s, it) => {
    const v = parseFloat(it.taxableValue) || 0;
    const r = parseFloat(it.taxRate) || 0;
    return s + (v * r) / 100;
  }, 0);



  function downloadJSON() {
    const data = { ...form, items, totalTaxable, totalTax, grandTotal: totalTaxable + totalTax };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `EWayBill-${form.eWayBillNo || "draft"}.json`; a.click();
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `*E-Way Bill — ${SHOP.name}*\nEWB No: ${form.eWayBillNo || "Draft"}\nInvoice: ${form.invoiceNo} | Vehicle: ${form.vehicleNumber}\nTo: ${form.consigneeName}\nValue: ₹${(totalTaxable + totalTax).toFixed(2)}\nPhone: ${SHOP.phone}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const inputCls = `w-full rounded-lg border px-3 py-2 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--gold))] focus:ring-1 focus:ring-[hsl(var(--gold))] transition-colors`;
  const label = (t: string) => <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">{t}</label>;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl p-5 border space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
      <h3 className="font-semibold text-sm text-gold">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-5">
        {/* Header */}
        <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#1e40af,#1d4ed8)" }}>
          <p className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{SHOP.name}</p>
          <p className="text-xs text-blue-200">GSTIN: {SHOP.gst} · E-Way Bill Generation</p>
        </div>

        {/* Invoice Details */}
        <Section title="Invoice / Bill Reference">
          <div className="grid grid-cols-2 gap-3">
            <div>{label("E-Way Bill No.")}<input className={inputCls} placeholder="EWB-XXXXXXXXXX" value={form.eWayBillNo} onChange={(e) => setField("eWayBillNo", e.target.value)} /></div>
            <div>{label("Invoice No.")}<input className={inputCls} placeholder="INV-001" value={form.invoiceNo} onChange={(e) => setField("invoiceNo", e.target.value)} /></div>
            <div>{label("Invoice Date")}<input type="date" className={inputCls} value={form.invoiceDate} onChange={(e) => setField("invoiceDate", e.target.value)} /></div>
            <div>{label("Supply Type")}
              <select className={inputCls} value={form.supplyType} onChange={(e) => setField("supplyType", e.target.value)}>
                {["Outward", "Inward"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* Consignee */}
        <Section title="Consignee (Ship To)">
          <div className="grid grid-cols-2 gap-3">
            <div>{label("Consignee Name")}<input className={inputCls} placeholder="Customer name" value={form.consigneeName} onChange={(e) => setField("consigneeName", e.target.value)} /></div>
            <div>{label("Consignee GSTIN")}<input className={inputCls} placeholder="Optional" value={form.consigneeGstin} onChange={(e) => setField("consigneeGstin", e.target.value)} /></div>
          </div>
          <div>{label("Delivery Address")}<textarea className={`${inputCls} resize-none`} rows={2} value={form.deliveryAddress} onChange={(e) => setField("deliveryAddress", e.target.value)} /></div>
        </Section>

        {/* HSN Items */}
        <div className="rounded-2xl p-5 border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gold">HSN / Item Details</h3>
            <Button size="sm" onClick={addItem} className="gold-gradient text-white gap-1.5"><Plus size={15} /> Add Item</Button>
          </div>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="invoice-item-row rounded-xl p-4 border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-semibold text-gold">Item {idx + 1}</span>
                  {items.length > 1 && <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>{label("Description")}<input className={inputCls} placeholder="Product/service" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} /></div>
                  <div>{label("HSN/SAC Code")}<input className={inputCls} placeholder="e.g. 7610" value={item.hsnCode} onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>{label("Qty")}<input type="number" className={inputCls} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} /></div>
                  <div>{label("Unit")}<select className={inputCls} value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></div>
                  <div>{label("Taxable Value (₹)")}<input type="number" className={inputCls} placeholder="0.00" value={item.taxableValue} onChange={(e) => updateItem(item.id, "taxableValue", e.target.value)} /></div>
                  <div>{label("Tax Rate %")}<input type="number" className={inputCls} placeholder="18" value={item.taxRate} onChange={(e) => updateItem(item.id, "taxRate", e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport */}
        <Section title="Part B — Transport Details">
          <div className="grid grid-cols-2 gap-3">
            <div>{label("Transporter Name")}<input className={inputCls} placeholder="Transporter company" value={form.transporterName} onChange={(e) => setField("transporterName", e.target.value)} /></div>
            <div>{label("Transporter ID / GSTIN")}<input className={inputCls} placeholder="Optional" value={form.transporterId} onChange={(e) => setField("transporterId", e.target.value)} /></div>
            <div>{label("Vehicle Number")}<input className={inputCls} placeholder="e.g. TN33AB1234" value={form.vehicleNumber} onChange={(e) => setField("vehicleNumber", e.target.value)} /></div>
            <div>{label("Transport Mode")}
              <select className={inputCls} value={form.transportMode} onChange={(e) => setField("transportMode", e.target.value)}>
                {["Road", "Rail", "Air", "Ship"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>{label("Distance (km)")}<input type="number" className={inputCls} placeholder="e.g. 120" value={form.distance} onChange={(e) => setField("distance", e.target.value)} /></div>
            <div>{label("Total Weight (kg)")}<input type="number" className={inputCls} placeholder="e.g. 250" value={form.weight} onChange={(e) => setField("weight", e.target.value)} /></div>
          </div>
        </Section>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl p-5 border sticky top-20 space-y-4" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold text-sm">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]"><span>Taxable Value</span><span>₹ {totalTaxable.toFixed(2)}</span></div>
            <div className="flex justify-between text-[hsl(var(--muted-foreground))]"><span>Total Tax</span><span>₹ {totalTax.toFixed(2)}</span></div>
            <div className="h-px" style={{ background: "hsl(var(--border))" }} />
            <div className="flex justify-between font-bold text-gold"><span>Invoice Value</span><span>₹ {(totalTaxable + totalTax).toFixed(2)}</span></div>
          </div>
          <div className="space-y-2 pt-2">
            <Button className="w-full gold-gradient text-white font-semibold gap-2" onClick={() => setShowPreview(!showPreview)}>
              <Truck size={16} /> {showPreview ? "Hide Preview" : "Preview E-Way Bill"}
            </Button>

            <Button variant="outline" className="w-full gap-2" onClick={downloadJSON}>
              <FileJson size={15} /> Export JSON
            </Button>
            <Button variant="outline" className="w-full gap-2 border-green-400 text-green-600 hover:bg-green-50" onClick={shareWhatsApp}>
              <MessageCircle size={15} /> Share on WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-5 overflow-x-auto print:block print-only print:m-0 print:p-0 print:opacity-100 print:static ${showPreview ? "animate-fade-in block" : "absolute -left-[9999px] opacity-0"}`}>
        <div className="min-w-[700px]">
          <EWayBillPreview form={form} items={items} />
        </div>
      </div>
    </div>
  );
}
