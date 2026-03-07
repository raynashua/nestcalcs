export interface PricingConfig {
  cpuPerCore: number;
  ramPerGb: number;
  ssdPerGb: number;
  hddPerGb: number;
  backupPerGb: number;
  windowsServer: number;
  ipv4PerAddress: number;
}

export const DEFAULT_PRICING: PricingConfig = {
  cpuPerCore: 50,
  ramPerGb: 30,
  ssdPerGb: 2,
  hddPerGb: 0.8,
  backupPerGb: 0.5,
  windowsServer: 350,
};

const STORAGE_KEY = "vps-pricing-config";

export function loadPricing(): PricingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_PRICING, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_PRICING };
}

export function savePricing(config: PricingConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetPricing() {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatBWP(amount: number): string {
  return `BWP ${amount.toLocaleString("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
