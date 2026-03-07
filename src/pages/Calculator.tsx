import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { loadPricing, formatBWP } from "@/lib/pricing";
import { ArrowLeft, Info } from "lucide-react";

const TOOLTIPS = {
  cpu: "Number of virtual CPU cores assigned to your server. More cores = better multitasking.",
  ram: "Memory available to applications running on your VPS. More RAM = smoother performance.",
  ssd: "Fast solid-state storage for your operating system and applications.",
  hdd: "Cost-effective storage for large files, backups, and archives.",
  backup: "Additional storage for automated backups of your VPS data.",
};

function ResourceSlider({
  label,
  emoji,
  tooltip,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  emoji: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-medium text-card-foreground">{label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px]">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-lg font-bold text-primary tabular-nums">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
}

const Calculator = () => {
  const navigate = useNavigate();
  const pricing = loadPricing();

  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [ssd, setSsd] = useState(0);
  const [hdd, setHdd] = useState(0);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [backup, setBackup] = useState(0);
  const [useIndustryDefault, setUseIndustryDefault] = useState(false);
  const [windowsEnabled, setWindowsEnabled] = useState(false);
  const [sqlServerEnabled, setSqlServerEnabled] = useState(false);
  const [ipv4Count, setIpv4Count] = useState(0);

  // 7-day incremental backup: 1 full + 7 daily incrementals at 5% daily change rate
  const totalStorage = ssd + hdd;
  const dailyChangeRate = 0.05;
  const calculatedBackupGb = Math.ceil(totalStorage * (1 + 7 * dailyChangeRate));
  const effectiveBackup = backupEnabled
    ? useIndustryDefault
      ? calculatedBackupGb
      : backup
    : 0;

  const costs = useMemo(() => {
    const computeCost = cpu * pricing.cpuPerCore + ram * pricing.ramPerGb;
    const ssdCost = ssd * pricing.ssdPerGb;
    const hddCost = hdd * pricing.hddPerGb;
    const backupCost = effectiveBackup * pricing.backupPerGb;
    const windowsCost = windowsEnabled ? pricing.windowsServer : 0;
    const sqlServerCost = sqlServerEnabled ? pricing.sqlServerStandard : 0;
    const ipv4Cost = ipv4Count * pricing.ipv4PerAddress;
    const total = computeCost + ssdCost + hddCost + backupCost + windowsCost + sqlServerCost + ipv4Cost;
    return { computeCost, ssdCost, hddCost, backupCost, windowsCost, sqlServerCost, ipv4Cost, total };
  }, [cpu, ram, ssd, hdd, effectiveBackup, windowsEnabled, ipv4Count, pricing]);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">🧮 Build Your VPS</h1>
          <p className="text-muted-foreground">
            Drag the sliders to build your perfect VPS!
          </p>
        </div>

        {/* Compute & Storage side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Compute */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-card-foreground">💻 Compute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResourceSlider
                label="vCPU Cores"
                emoji="⚡"
                tooltip={TOOLTIPS.cpu}
                value={cpu}
                min={0}
                max={128}
                step={1}
                unit="cores"
                onChange={setCpu}
              />
              <ResourceSlider
                label="RAM"
                emoji="🧠"
                tooltip={TOOLTIPS.ram}
                value={ram}
                min={0}
                max={256}
                step={1}
                unit="GB"
                onChange={setRam}
              />
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-card-foreground">💾 Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResourceSlider
                label="SSD Storage"
                emoji="⚡"
                tooltip={TOOLTIPS.ssd}
                value={ssd}
                min={0}
                max={5000}
                step={10}
                unit="GB"
                onChange={setSsd}
              />
              <ResourceSlider
                label="HDD Storage"
                emoji="📀"
                tooltip={TOOLTIPS.hdd}
                value={hdd}
                min={0}
                max={8000}
                step={10}
                unit="GB"
                onChange={setHdd}
              />
            </CardContent>
          </Card>
        </div>

        {/* Backup, OS, and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Backup */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-card-foreground">🛡️ Backup</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {backupEnabled ? "On" : "Off"}
                  </span>
                  <Switch checked={backupEnabled} onCheckedChange={setBackupEnabled} />
                </div>
              </div>
            </CardHeader>
            {backupEnabled && (
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-card-foreground">Use 7 Incremental Values</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[240px]">
                        <p className="text-xs">Calculates backup capacity for 1 full + 7 daily incremental backups, assuming 30% annual data change rate.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{useIndustryDefault ? "Yes" : "No"}</span>
                    <Switch checked={useIndustryDefault} onCheckedChange={setUseIndustryDefault} />
                  </div>
                </div>

                {useIndustryDefault ? (
                  <div className="rounded-md bg-muted/50 p-3 space-y-1">
                    <p className="text-sm text-card-foreground">
                      Total storage: <span className="font-semibold">{totalStorage.toLocaleString()} GB</span>
                    </p>
                    <p className="text-sm text-card-foreground">
                      Required backup capacity: <span className="font-bold text-primary">{calculatedBackupGb.toLocaleString()} GB</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Based on 5% daily change rate</p>
                  </div>
                ) : (
                  <ResourceSlider
                    label="Backup Storage"
                    emoji="☁️"
                    tooltip={TOOLTIPS.backup}
                    value={backup}
                    min={0}
                    max={10000}
                    step={10}
                    unit="GB"
                    onChange={setBackup}
                  />
                )}
              </CardContent>
            )}
          </Card>

          {/* Extras */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-card-foreground mb-2">🧩 Extras</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">🖥️ OS</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {windowsEnabled ? "Windows" : "Linux"}
                  </span>
                  <Switch checked={windowsEnabled} onCheckedChange={setWindowsEnabled} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {windowsEnabled
                  ? "Windows Server 2025 Standard license included."
                  : "Linux (no additional cost)."}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">🌐 IPv4 Addresses</span>
                <Select value={String(ipv4Count)} onValueChange={(v) => setIpv4Count(Number(v))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">💰 Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceLine label="Compute (vCPU + RAM)" amount={costs.computeCost} />
              <PriceLine label="SSD Storage" amount={costs.ssdCost} />
              <PriceLine label="HDD Storage" amount={costs.hddCost} />
              {backupEnabled && (
                <PriceLine label="Backup Storage" amount={costs.backupCost} />
              )}
              {windowsEnabled && (
                <PriceLine label="Windows Server 2025 Std" amount={costs.windowsCost} />
              )}
              {ipv4Count > 0 && (
                <PriceLine label={`IPv4 Address ×${ipv4Count}`} amount={costs.ipv4Cost} />
              )}

              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-card-foreground">Total / month</span>
                  <span className="text-2xl font-bold text-primary animate-price">
                    {formatBWP(costs.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Prices in Botswana Pula (BWP) · Excl. VAT
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function PriceLine({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-card-foreground animate-price">{formatBWP(amount)}</span>
    </div>
  );
}

export default Calculator;

