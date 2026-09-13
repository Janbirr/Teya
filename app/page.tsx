import { LoveLetter } from "@/components/love-letter"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* soft blue glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.85_0.08_245/0.6),transparent),radial-gradient(50%_40%_at_100%_100%,oklch(0.82_0.09_250/0.5),transparent)]"
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
        <header className="text-center">
          <h1 className="text-balance font-script text-5xl text-primary sm:text-6xl">For You, My Love</h1>
          <p className="mt-3 text-pretty font-serif text-lg text-muted-foreground">
            A little message, wrapped in blue flowers.
          </p>
        </header>

        <LoveLetter />

        <footer className="text-center font-serif text-sm text-muted-foreground">Made with love, just for you.</footer>
      </div>
    </main>
  )
}
