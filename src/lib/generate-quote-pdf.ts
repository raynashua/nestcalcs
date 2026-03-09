import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatBWP, type CostType } from "./pricing";

interface QuoteLineItem {
  description: string;
  detail: string;
  amount: number;
  costType: CostType;
}

export interface ClientInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

interface QuoteData {
  cpu: number;
  ram: number;
  ssd: number;
  hdd: number;
  backupGb: number;
  backupEnabled: boolean;
  windowsEnabled: boolean;
  sqlServerEnabled: boolean;
  ipv4Count: number;
  client: ClientInfo;
  costTypes: Record<string, CostType>;
  costs: {
    computeCost: number;
    ssdCost: number;
    hddCost: number;
    backupCost: number;
    windowsCost: number;
    sqlServerCost: number;
    ipv4Cost: number;
    total: number;
    monthlyTotal: number;
    oneoffTotal: number;
  };
}

// ── Brand colors ──
const navy: [number, number, number] = [18, 26, 40];
const red: [number, number, number] = [184, 23, 23];
const darkGray: [number, number, number] = [60, 60, 70];
const lightGray: [number, number, number] = [230, 232, 237];
const white: [number, number, number] = [255, 255, 255];

function buildLineItems(data: QuoteData): QuoteLineItem[] {
  const ct = data.costTypes;
  const items: QuoteLineItem[] = [];

  if (data.cpu > 0 || data.ram > 0) {
    // Split compute into CPU and RAM if they have different cost types
    if (data.cpu > 0) {
      items.push({
        description: "Compute – vCPU Cores",
        detail: `${data.cpu} vCPU Cores`,
        amount: data.cpu * (data.costs.computeCost / (data.cpu + data.ram || 1)) * (data.cpu / (data.cpu || 1)),
        costType: ct.cpuPerCore || "monthly",
      });
    }
    if (data.ram > 0) {
      items.push({
        description: "Compute – RAM",
        detail: `${data.ram} GB RAM`,
        amount: data.costs.computeCost - (data.cpu > 0 ? items[items.length - 1]?.amount || 0 : 0),
        costType: ct.ramPerGb || "monthly",
      });
    }
  }
  if (data.ssd > 0) {
    items.push({
      description: "SSD Storage",
      detail: `${data.ssd.toLocaleString()} GB NVMe SSD`,
      amount: data.costs.ssdCost,
      costType: ct.ssdPerGb || "monthly",
    });
  }
  if (data.hdd > 0) {
    items.push({
      description: "HDD Storage",
      detail: `${data.hdd.toLocaleString()} GB HDD`,
      amount: data.costs.hddCost,
      costType: ct.hddPerGb || "monthly",
    });
  }
  if (data.backupEnabled && data.backupGb > 0) {
    items.push({
      description: "Backup Storage",
      detail: `${data.backupGb.toLocaleString()} GB (7-day incremental)`,
      amount: data.costs.backupCost,
      costType: ct.backupPerGb || "monthly",
    });
  }
  if (data.windowsEnabled) {
    items.push({
      description: "Windows Server 2025 Standard",
      detail: "License included",
      amount: data.costs.windowsCost,
      costType: ct.windowsServer || "oneoff",
    });
  }
  if (data.sqlServerEnabled) {
    items.push({
      description: "SQL Server Standard",
      detail: "License included",
      amount: data.costs.sqlServerCost,
      costType: ct.sqlServerStandard || "oneoff",
    });
  }
  if (data.ipv4Count > 0) {
    items.push({
      description: "Public IPv4 Addresses",
      detail: `${data.ipv4Count} address${data.ipv4Count > 1 ? "es" : ""}`,
      amount: data.costs.ipv4Cost,
      costType: ct.ipv4PerAddress || "monthly",
    });
  }
  return items;
}

function renderHeader(doc: jsPDF, pageWidth: number, quoteNumber: string) {
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 42, "F");
  doc.setFillColor(...red);
  doc.rect(0, 42, pageWidth, 3, "F");

  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NASHUA BOTSWANA", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("VPS Hosting Services", 14, 28);
  doc.text("Cloud Solutions Provider", 14, 34);

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION", pageWidth - 14, 22, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(quoteNumber, pageWidth - 14, 30, { align: "right" });
}

function renderDetailsBlock(doc: jsPDF, pageWidth: number, data: QuoteData, quoteNumber: string, today: string, validUntil: string): number {
  let y = 55;
  doc.setTextColor(...darkGray);
  doc.setFontSize(9);

  const detailsLeft = [
    ["Quote Number:", quoteNumber],
    ["Date:", today],
    ["Valid Until:", validUntil],
    ["Currency:", "Botswana Pula (BWP)"],
  ];

  detailsLeft.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 55, y);
    y += 6;
  });

  let cy = 55;
  const clientDetails = [
    ["Company:", data.client.companyName],
    ["Contact:", data.client.contactName],
    ["Email:", data.client.email],
    ["Phone:", data.client.phone],
  ];

  clientDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, pageWidth / 2 + 10, cy);
    doc.setFont("helvetica", "normal");
    doc.text(value, pageWidth / 2 + 35, cy);
    cy += 6;
  });

  return y;
}

function renderItemTable(
  doc: jsPDF,
  startY: number,
  sectionTitle: string,
  costLabel: string,
  items: QuoteLineItem[],
  subtotal: number,
  pageWidth: number
): number {
  // Section header
  doc.setFillColor(...navy);
  doc.rect(14, startY, pageWidth - 28, 8, "F");
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(sectionTitle, 18, startY + 5.5);

  const tableY = startY + 14;
  const tableBody = items.map((item, i) => [
    String(i + 1),
    item.description,
    item.detail,
    formatBWP(item.amount),
  ]);

  autoTable(doc, {
    startY: tableY,
    head: [["#", "Item", "Specification", costLabel]],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: navy,
      textColor: white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: {
      textColor: darkGray,
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: lightGray,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 55 },
      2: { cellWidth: 70 },
      3: { cellWidth: 40, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 2;

  // Subtotal row
  doc.setFillColor(40, 50, 65);
  doc.rect(14, finalY, pageWidth - 28, 10, "F");
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Subtotal (${sectionTitle})`, 18, finalY + 7);
  doc.text(formatBWP(subtotal), pageWidth - 18, finalY + 7, { align: "right" });

  return finalY + 14;
}

function renderFooter(doc: jsPDF, pageWidth: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(...red);
  doc.rect(0, pageHeight - 16, pageWidth, 2, "F");
  doc.setFillColor(...navy);
  doc.rect(0, pageHeight - 14, pageWidth, 14, "F");

  doc.setTextColor(160, 165, 180);
  doc.setFontSize(7);
  doc.text("Nashua Botswana · VPS Hosting Services · www.nashua.co.bw", pageWidth / 2, pageHeight - 6, { align: "center" });
}

export function generateQuotePdf(data: QuoteData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const quoteNumber = `NQ-${Date.now().toString(36).toUpperCase()}`;
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const validUntil = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  renderHeader(doc, pageWidth, quoteNumber);
  let y = renderDetailsBlock(doc, pageWidth, data, quoteNumber, today, validUntil);
  y += 6;

  const allItems = buildLineItems(data);
  const monthlyItems = allItems.filter((i) => i.costType === "monthly");
  const oneoffItems = allItems.filter((i) => i.costType === "oneoff");
  const monthlyTotal = monthlyItems.reduce((s, i) => s + i.amount, 0);
  const oneoffTotal = oneoffItems.reduce((s, i) => s + i.amount, 0);

  // Monthly section
  if (monthlyItems.length > 0) {
    y = renderItemTable(doc, y, "MONTHLY COSTS", "Monthly Cost", monthlyItems, monthlyTotal, pageWidth);
    y += 4;
  }

  // One-off section
  if (oneoffItems.length > 0) {
    y = renderItemTable(doc, y, "ONE-OFF COSTS", "One-off Cost", oneoffItems, oneoffTotal, pageWidth);
    y += 4;
  }

  // Grand totals
  doc.setFillColor(...navy);
  doc.rect(14, y, pageWidth - 28, monthlyTotal > 0 && oneoffTotal > 0 ? 22 : 14, "F");
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");

  if (monthlyTotal > 0) {
    doc.setFontSize(11);
    doc.text("TOTAL MONTHLY", 18, y + 9);
    doc.setFontSize(13);
    doc.text(formatBWP(monthlyTotal), pageWidth - 18, y + 9, { align: "right" });
  }
  if (oneoffTotal > 0) {
    const offsetY = monthlyTotal > 0 ? 10 : 0;
    doc.setFontSize(11);
    doc.text("TOTAL ONE-OFF", 18, y + 9 + offsetY);
    doc.setFontSize(13);
    doc.text(formatBWP(oneoffTotal), pageWidth - 18, y + 9 + offsetY, { align: "right" });
  }

  const totalBoxHeight = monthlyTotal > 0 && oneoffTotal > 0 ? 22 : 14;
  y += totalBoxHeight + 10;

  // Terms & conditions
  doc.setTextColor(...darkGray);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Terms & Conditions", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const notes = [
    "• All prices are in Botswana Pula (BWP) and exclude applicable VAT.",
    "• This quotation is valid for 30 days from the date of issue.",
    "• Pricing is subject to change based on resource availability.",
    "• Monthly costs are billed monthly in advance. One-off costs are billed once on setup.",
    "• 99.9% uptime SLA guaranteed on all VPS configurations.",
  ];
  notes.forEach((note) => {
    doc.text(note, 14, y);
    y += 5;
  });

  renderFooter(doc, pageWidth);
  doc.save(`VPS-Quote-${quoteNumber}.pdf`);
}
