import { ClarityCanvas } from "@/components/clarity-canvas";
import { Icons } from "@/components/icons";

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
        </div>
      </header>
      <main className="flex-1">
        <ClarityCanvas />
      </main>
    </div>
  );
}
