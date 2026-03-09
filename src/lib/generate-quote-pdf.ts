import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatBWP } from "./pricing";

interface QuoteLineItem {
  description: string;
  detail: string;
  monthly: number;
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
  costs: {
    computeCost: number;
    ssdCost: number;
    hddCost: number;
    backupCost: number;
    windowsCost: number;
    sqlServerCost: number;
    ipv4Cost: number;
    total: number;
  };
}

export function generateQuotePdf(data: QuoteData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const quoteNumber = `NQ-${Date.now().toString(36).toUpperCase()}`;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const validUntil = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Brand colors (HSL 220 45% 11% → navy, HSL 355 80% 45% → red) ──
  const navy: [number, number, number] = [18, 26, 40];
  const red: [number, number, number] = [184, 23, 23];
  const darkGray: [number, number, number] = [60, 60, 70];
  const lightGray: [number, number, number] = [230, 232, 237];
  const white: [number, number, number] = [255, 255, 255];

  // ── Header bar ──
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent stripe
  doc.setFillColor(...red);
  doc.rect(0, 42, pageWidth, 3, "F");

  // Company name
  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NASHUA BOTSWANA", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("VPS Hosting Services", 14, 28);
  doc.text("Cloud Solutions Provider", 14, 34);

  // Quote label on right
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION", pageWidth - 14, 22, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${quoteNumber}`, pageWidth - 14, 30, { align: "right" });

  // ── Quote details ──
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

  // ── Section: Configuration summary ──
  y += 6;
  doc.setFillColor(...navy);
  doc.rect(14, y, pageWidth - 28, 8, "F");
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("VPS CONFIGURATION", 18, y + 5.5);
  y += 14;

  // ── Build line items ──
  const items: QuoteLineItem[] = [];

  if (data.cpu > 0 || data.ram > 0) {
    items.push({
      description: "Compute Resources",
      detail: `${data.cpu} vCPU Cores, ${data.ram} GB RAM`,
      monthly: data.costs.computeCost,
    });
  }
  if (data.ssd > 0) {
    items.push({
      description: "SSD Storage",
      detail: `${data.ssd.toLocaleString()} GB NVMe SSD`,
      monthly: data.costs.ssdCost,
    });
  }
  if (data.hdd > 0) {
    items.push({
      description: "HDD Storage",
      detail: `${data.hdd.toLocaleString()} GB HDD`,
      monthly: data.costs.hddCost,
    });
  }
  if (data.backupEnabled && data.backupGb > 0) {
    items.push({
      description: "Backup Storage",
      detail: `${data.backupGb.toLocaleString()} GB (7-day incremental)`,
      monthly: data.costs.backupCost,
    });
  }
  if (data.windowsEnabled) {
    items.push({
      description: "Windows Server 2025 Standard",
      detail: "License included",
      monthly: data.costs.windowsCost,
    });
  }
  if (data.sqlServerEnabled) {
    items.push({
      description: "SQL Server Standard",
      detail: "License included",
      monthly: data.costs.sqlServerCost,
    });
  }
  if (data.ipv4Count > 0) {
    items.push({
      description: "Public IPv4 Addresses",
      detail: `${data.ipv4Count} address${data.ipv4Count > 1 ? "es" : ""}`,
      monthly: data.costs.ipv4Cost,
    });
  }

  // ── Table ──
  const tableBody = items.map((item, i) => [
    String(i + 1),
    item.description,
    item.detail,
    formatBWP(item.monthly),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["#", "Item", "Specification", "Monthly Cost"]],
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

  // ── Total row ──
  const finalY = (doc as any).lastAutoTable.finalY + 2;

  doc.setFillColor(...navy);
  doc.rect(14, finalY, pageWidth - 28, 14, "F");
  doc.setTextColor(...white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL MONTHLY COST", 18, finalY + 9.5);
  doc.setFontSize(14);
  doc.text(formatBWP(data.costs.total), pageWidth - 18, finalY + 9.5, { align: "right" });

  // ── Footer notes ──
  let footerY = finalY + 24;

  doc.setTextColor(...darkGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const notes = [
    "• All prices are in Botswana Pula (BWP) and exclude applicable VAT.",
    "• This quotation is valid for 30 days from the date of issue.",
    "• Pricing is subject to change based on resource availability.",
    "• Minimum contract period: 1 month. Billed monthly in advance.",
    "• 99.9% uptime SLA guaranteed on all VPS configurations.",
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Terms & Conditions", 14, footerY);
  footerY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  notes.forEach((note) => {
    doc.text(note, 14, footerY);
    footerY += 5;
  });

  // ── Bottom bar ──
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(...red);
  doc.rect(0, pageHeight - 16, pageWidth, 2, "F");
  doc.setFillColor(...navy);
  doc.rect(0, pageHeight - 14, pageWidth, 14, "F");

  doc.setTextColor(160, 165, 180);
  doc.setFontSize(7);
  doc.text("Nashua Botswana · VPS Hosting Services · www.nashua.co.bw", pageWidth / 2, pageHeight - 6, { align: "center" });

  // ── Save ──
  doc.save(`VPS-Quote-${quoteNumber}.pdf`);
}
