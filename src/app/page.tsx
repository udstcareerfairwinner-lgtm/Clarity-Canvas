import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <Icons.logo className="h-8 w-8 mr-2 text-primary" />
            <span className="font-headline text-2xl font-bold tracking-tighter">
              Clarity Canvas
            </span>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/canvas">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter">
              Transform Your Sketches into{' '}
              <span className="text-primary">Polished Diagrams</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Clarity Canvas uses AI to instantly redraw your hand-drawn
              diagrams, flowcharts, and mind maps into clean, professional-looking visuals.
            </p>
            <Link href="/canvas">
              <Button size="lg" className="text-lg">
                Start Drawing Now
              </Button>
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://storage.googleapis.com/studioprompt/asset-library/clarity-canvas-demo.png"
              alt="Clarity Canvas Demo"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl border"
            />
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clarity Canvas. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
