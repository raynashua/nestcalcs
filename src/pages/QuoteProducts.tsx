import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  loadProducts,
  saveProducts,
  resetProducts,
  DEFAULT_PRODUCTS,
  type ProductItem,
} from "@/lib/products";
import { formatBWP } from "@/lib/pricing";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "admin123";

const QuoteProducts = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<ProductItem[]>(loadProducts);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else toast.error("Incorrect password");
  };

  const update = (id: string, field: keyof ProductItem, value: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, [field]: field === "price" ? Math.max(0, parseFloat(value) || 0) : value }
          : it,
      ),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, partNumber: "", description: "", price: 0 },
    ]);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const handleSave = () => {
    const invalid = items.some((it) => !it.partNumber.trim() || !it.description.trim());
    if (invalid) {
      toast.error("Every item needs a part number and description");
      return;
    }
    saveProducts(items);
    toast.success("Product list saved!");
  };

  const handleReset = () => {
    resetProducts();
    setItems(DEFAULT_PRODUCTS.map((p) => ({ ...p })));
    toast.success("Reset to default products");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm bg-card border-border">
          <CardHeader className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-card-foreground">Product Admin</CardTitle>
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
              <Button type="submit" className="w-full">Unlock</Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/quote-builder")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/quote-builder")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">📦 Quote Product Items</CardTitle>
            <p className="text-sm text-muted-foreground">
              Define the products available when building a quotation. Prices in Botswana Pula (BWP).
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-3 text-xs text-muted-foreground px-1">
              <div className="col-span-3">Part Number</div>
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Price (BWP)</div>
              <div className="col-span-1" />
            </div>

            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <Input
                  className="md:col-span-3"
                  placeholder="Part number"
                  value={it.partNumber}
                  onChange={(e) => update(it.id, "partNumber", e.target.value)}
                  maxLength={40}
                />
                <Input
                  className="md:col-span-6"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => update(it.id, "description", e.target.value)}
                  maxLength={120}
                />
                <Input
                  className="md:col-span-2"
                  type="number"
                  min="0"
                  step="0.01"
                  value={it.price}
                  onChange={(e) => update(it.id, "price", e.target.value)}
                />
                <div className="md:col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => removeItem(it.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">No products yet — add your first item.</p>
            )}

            <Button variant="secondary" onClick={addItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Product Item
            </Button>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Save Products
              </Button>
              <Button onClick={handleReset} variant="secondary">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              {items.length} item(s) · Example price format: {formatBWP(1234.5)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteProducts;
