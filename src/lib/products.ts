export interface ProductItem {
  id: string;
  partNumber: string;
  description: string;
  price: number;
}

export const VAT_RATE = 0.14;

const STORAGE_KEY = "quote-product-items";

export const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: "p1", partNumber: "VPS-CPU-1", description: "vCPU Core (monthly)", price: 50 },
  { id: "p2", partNumber: "VPS-RAM-1", description: "1 GB RAM (monthly)", price: 30 },
  { id: "p3", partNumber: "VPS-SSD-1", description: "1 GB SSD Storage (monthly)", price: 2 },
  { id: "p4", partNumber: "OS-WIN-2025", description: "Windows Server 2025 Standard Licence", price: 350 },
  { id: "p5", partNumber: "SQL-STD", description: "SQL Server Standard Licence", price: 500 },
  { id: "p6", partNumber: "NET-IPV4", description: "Public IPv4 Address", price: 25 },
];

export function loadProducts(): ProductItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((p) => p && typeof p === "object")
          .map((p, i) => ({
            id: String(p.id ?? `p${i}`),
            partNumber: String(p.partNumber ?? ""),
            description: String(p.description ?? ""),
            price: Number(p.price) || 0,
          }));
      }
    }
  } catch {}
  return DEFAULT_PRODUCTS.map((p) => ({ ...p }));
}

export function saveProducts(items: ProductItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function resetProducts() {
  localStorage.removeItem(STORAGE_KEY);
}
