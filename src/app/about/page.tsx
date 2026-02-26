import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter sm:text-5xl">About Thrift Clothing Plug</h1>
      
      <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
        <div className="space-y-4">
          <p>
            Thrift Clothing Plug is a curated resale and redesign brand transforming pre-owned garments into elevated, statement-ready pieces. We specialize in sourcing high-potential thrift apparel and re-engineering it through intentional design, tailoring, and detailing to create refreshed, trend-aligned collections.
          </p>
          
          <p>
            Our model sits at the intersection of sustainability and street culture. Instead of producing mass-market inventory, we recover quality garments, reconstruct them with creative precision, and release limited drops that prioritize individuality over replication. Every piece carries history — refined with modern aesthetics and structured for contemporary wear.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">We operate on three core pillars:</h2>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="bg-muted/50 border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide">Circular Fashion</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                Extending garment lifecycle through redesign and controlled redistribution.
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide">Design Reinvention</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                Strategic alterations, reconstruction, and detailing to convert standard thrift into premium streetwear.
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide">Scarcity Advantage</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                Scarcity-driven collections that maintain exclusivity and uniqueness.
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pt-8 border-t">
          <p className="text-xl font-medium text-foreground italic text-center">
            Thrift Clothing Plug is not fast fashion. It is curated transformation — engineered to deliver style, sustainability, and distinction in every drop.
          </p>
        </div>
      </div>
    </div>
  );
}
