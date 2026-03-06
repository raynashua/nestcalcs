import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="text-center mb-12 max-w-2xl">
        <div className="text-5xl mb-4">☁️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          VPS Hosting Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Build your perfect VPS and instantly see the monthly price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card
          className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card border-border"
          onClick={() => navigate("/calculator")}
        >
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧮</div>
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">Calculate VPS Cost</h2>
            <p className="text-sm text-muted-foreground">
              Configure your ideal server and get an instant price estimate
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card border-border"
          onClick={() => navigate("/admin")}
        >
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">Admin Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure pricing rates and manage cost parameters
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        🇧🇼 Proudly serving Botswana · Prices in BWP
      </p>
    </div>
  );
};

export default Index;
