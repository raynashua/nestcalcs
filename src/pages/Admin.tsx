import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loadPricing, savePricing, resetPricing, DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing";
import { ArrowLeft, Save, RotateCcw, Lock } from "lucide-react";
import { toast } from "sonner";

// Change this value to update the admin password
const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState<PricingConfig>(loadPricing);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  const updateField = (key: keyof PricingConfig, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setConfig((prev) => ({ ...prev, [key]: num }));
    }
  };

  const handleSave = () => {
    savePricing(config);
    toast.success("Pricing settings saved!");
  };

  const handleReset = () => {
    resetPricing();
    setConfig({ ...DEFAULT_PRICING });
    toast.success("Reset to default pricing");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm bg-card border-border">
          <CardHeader className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-card-foreground">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields: { key: keyof PricingConfig; label: string; unit: string }[] = [
    { key: "cpuPerCore", label: "Cost per vCPU Core", unit: "BWP / core / month" },
    { key: "ramPerGb", label: "Cost per GB of RAM", unit: "BWP / GB / month" },
    { key: "ssdPerGb", label: "Cost per GB of SSD", unit: "BWP / GB / month" },
    { key: "hddPerGb", label: "Cost per GB of HDD", unit: "BWP / GB / month" },
    { key: "backupPerGb", label: "Cost per GB of Backup", unit: "BWP / GB / month" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">⚙️ Pricing Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure the per-unit monthly pricing in Botswana Pula (BWP).
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {fields.map(({ key, label, unit }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-card-foreground">{label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    step="0.01"
                    value={config[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap w-36">
                    {unit}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </Button>
              <Button onClick={handleReset} variant="secondary">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
