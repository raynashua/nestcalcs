import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadProducts, VAT_RATE, type ProductItem } from "@/lib/products";
import { formatBWP } from "@/lib/pricing";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QuoteLine {
  id: string;
  productId: string;
  partNumber: string;
  description: string;
  price: number;
  quantity: number;
}

const QuoteCreate = () => {
  const navigate = useNavigate();
  const products = useMemo<ProductItem[]>(() => loadProducts(), []);
  const [selected, setSelected] = useState<string>("");
  const [lines, setLines] = useState<QuoteLine[]>([]);

  const addLine = () => {
    const product = products.find((p) => p.id === selected);
    if (!product) {
      toast.error("Choose a product first");
      return;
    }
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) {
      setLines((prev) =>
        prev.map((l) => (l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l)),
      );
      return;
    }
    setLines((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        productId: product.id,
        partNumber: product.partNumber,
        description: product.description,
        price: product.price,
        quantity: 1,
      },
    ]);
  };

  const setQuantity = (id: string, value: string) => {
    const qty = Math.max(0, Math.floor(parseFloat(value) || 0));
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l)));
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/quote-builder")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">🧾 Create Quotation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add items from your product list. VAT is calculated at 14%.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product item" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.partNumber} — {p.description} ({formatBWP(p.price)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addLine}>
                <Plus className="mr-2 h-4 w-4" /> Add to Quote
              </Button>
            </div>

            {products.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No products defined yet — add some in Product Admin.
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-3 font-medium">Part Number</th>
                    <th className="py-2 pr-3 font-medium">Description</th>
                    <th className="py-2 pr-3 font-medium text-right">Unit Price</th>
                    <th className="py-2 pr-3 font-medium text-right">Qty</th>
                    <th className="py-2 pr-3 font-medium text-right">Line Total</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {lines.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No line items yet.
                      </td>
                    </tr>
                  )}
                  {lines.map((l) => (
                    <tr key={l.id} className="border-b border-border/60">
                      <td className="py-2 pr-3 text-card-foreground whitespace-nowrap">{l.partNumber}</td>
                      <td className="py-2 pr-3 text-card-foreground">{l.description}</td>
                      <td className="py-2 pr-3 text-right text-card-foreground whitespace-nowrap">
                        {formatBWP(l.price)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={l.quantity}
                          onChange={(e) => setQuantity(l.id, e.target.value)}
                          className="w-20 ml-auto text-right"
                        />
                      </td>
                      <td className="py-2 pr-3 text-right font-medium text-card-foreground whitespace-nowrap">
                        {formatBWP(l.price * l.quantity)}
                      </td>
                      <td className="py-2 text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeLine(l.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto w-full sm:w-80 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-card-foreground">{formatBWP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>VAT (14%)</span>
                <span className="text-card-foreground">{formatBWP(vat)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-border pt-2">
                <span className="text-card-foreground">Grand Total</span>
                <span className="text-primary">{formatBWP(grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteCreate;
