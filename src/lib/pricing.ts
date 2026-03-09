export type CostType = "monthly" | "oneoff";

export interface PricingConfig {
  cpuPerCore: number;
  ramPerGb: number;
  ssdPerGb: number;
  hddPerGb: number;
  backupPerGb: number;
  windowsServer: number;
  sqlServerStandard: number;
  ipv4PerAddress: number;
  costTypes: Record<string, CostType>;
}

export const DEFAULT_COST_TYPES: Record<string, CostType> = {
  cpuPerCore: "monthly",
  ramPerGb: "monthly",
  ssdPerGb: "monthly",
  hddPerGb: "monthly",
  backupPerGb: "monthly",
  windowsServer: "oneoff",
  sqlServerStandard: "oneoff",
  ipv4PerAddress: "monthly",
};

export const DEFAULT_PRICING: PricingConfig = {
  cpuPerCore: 50,
  ramPerGb: 30,
  ssdPerGb: 2,
  hddPerGb: 0.8,
  backupPerGb: 0.5,
  windowsServer: 350,
  sqlServerStandard: 500,
  ipv4PerAddress: 25,
  costTypes: { ...DEFAULT_COST_TYPES },
};

const STORAGE_KEY = "vps-pricing-config";

export function loadPricing(): PricingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_PRICING,
        ...parsed,
        costTypes: { ...DEFAULT_COST_TYPES, ...(parsed.costTypes || {}) },
      };
    }
  } catch {}
  return { ...DEFAULT_PRICING, costTypes: { ...DEFAULT_COST_TYPES } };
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
