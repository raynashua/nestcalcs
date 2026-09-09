import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, hsl(220 45% 8%) 0%, hsl(220 45% 11%) 30%, hsl(220 40% 14%) 60%, hsl(225 40% 10%) 100%)' }}
    >
      {/* Dynamic background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large primary glow top-right — pronounced */}
        <div className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full blur-[100px] animate-glow-1"
          style={{ background: 'radial-gradient(circle, hsl(355 80% 45% / 0.25) 0%, hsl(355 80% 45% / 0.08) 50%, transparent 70%)' }}
        />
        {/* Primary glow bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[90px] animate-glow-2"
          style={{ background: 'radial-gradient(circle, hsl(355 80% 45% / 0.2) 0%, hsl(355 80% 50% / 0.06) 50%, transparent 70%)' }}
        />
        {/* Deep blue orb center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[140px] animate-glow-3"
          style={{ background: 'radial-gradient(circle, hsl(220 40% 22% / 0.6) 0%, hsl(220 45% 14% / 0.3) 40%, transparent 70%)' }}
        />
        {/* Secondary warm accent orb */}
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px] animate-glow-2"
          style={{ background: 'radial-gradient(circle, hsl(355 60% 40% / 0.12) 0%, transparent 60%)' }}
        />
        {/* Grid overlay — more visible */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted-foreground)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        {/* Diagonal accent lines — wider and more visible */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[2px] h-[200%] rotate-[35deg]"
            style={{ background: 'linear-gradient(to bottom, transparent 10%, hsl(355 80% 45% / 0.3) 50%, transparent 90%)' }}
          />
          <div className="absolute -top-1/2 right-1/4 w-[2px] h-[200%] rotate-[35deg]"
            style={{ background: 'linear-gradient(to bottom, transparent 15%, hsl(355 80% 45% / 0.15) 50%, transparent 85%)' }}
          />
          <div className="absolute -top-1/2 left-1/3 w-[1px] h-[200%] rotate-[35deg]"
            style={{ background: 'linear-gradient(to bottom, transparent 20%, hsl(220 40% 50% / 0.15) 50%, transparent 80%)' }}
          />
        </div>
        {/* Bottom edge gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, hsl(220 45% 8% / 0.8), transparent)' }}
        />
        {/* Top edge vignette */}
        <div className="absolute top-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, hsl(220 45% 6% / 0.5), transparent)' }}
        />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl relative z-10">
        <Card
          className="cursor-pointer group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/80 backdrop-blur-sm border-border animate-fade-in"
          style={{ animationDuration: '0.5s', animationDelay: '0.28s', animationFillMode: 'both' }}
          onClick={() => navigate("/quote-builder")}
        >
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">Quote Builder</h2>
            <p className="text-sm text-muted-foreground">
              Create quotations or manage your product items and prices
            </p>
          </CardContent>
        </Card>

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

      <p className="mt-12 text-xs text-muted-foreground relative z-10 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.5s', animationFillMode: 'both' }}>
        🇧🇼 Proudly serving Botswana · Prices in BWP
      </p>
    </div>
  );
};

export default Index;
