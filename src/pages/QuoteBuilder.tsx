import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const QuoteBuilder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📄</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quote Builder</h1>
          <p className="text-muted-foreground">
            Create customer quotations or manage your product catalogue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer group hover:border-primary/50 transition-all bg-card border-border"
            onClick={() => navigate("/quote-builder/create")}
          >
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧾</div>
              <h2 className="text-xl font-semibold mb-2 text-card-foreground">Create Quotation</h2>
              <p className="text-sm text-muted-foreground">
                Pick products, set quantities and get totals with 14% VAT
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer group hover:border-primary/50 transition-all bg-card border-border"
            onClick={() => navigate("/quote-builder/products")}
          >
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
              <h2 className="text-xl font-semibold mb-2 text-card-foreground">Product Admin</h2>
              <p className="text-sm text-muted-foreground">
                Define part numbers, descriptions and prices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
