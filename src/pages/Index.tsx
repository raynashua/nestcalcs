import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Dynamic background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-glow-1" />
        {/* Radial glow bottom-left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px] animate-glow-2" />
        {/* Subtle accent orb center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary/20 blur-[160px] animate-glow-3" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/20 to-transparent rotate-[35deg]" />
          <div className="absolute -top-1/2 right-1/4 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/10 to-transparent rotate-[35deg]" />
        </div>
      </div>

      <div className="text-center mb-12 max-w-2xl relative z-10 animate-fade-in" style={{ animationDuration: '0.6s', animationFillMode: 'both' }}>
        <div className="text-5xl mb-4">☁️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          VPS Hosting Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Build your perfect VPS and instantly see the monthly price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        <Card
          className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/80 backdrop-blur-sm border-border animate-fade-in"
          style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}
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
          className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/80 backdrop-blur-sm border-border animate-fade-in"
          style={{ animationDuration: '0.5s', animationDelay: '0.35s', animationFillMode: 'both' }}
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

      <p className="mt-12 text-xs text-muted-foreground relative z-10">
        🇧🇼 Proudly serving Botswana · Prices in BWP
      </p>
    </div>
  );
};

export default Index;
