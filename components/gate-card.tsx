import type { ReactNode } from "react"

export function GateCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-sm">
        <img
          src="/images/blue-flowers-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 -left-6 w-32 opacity-90 mix-blend-multiply select-none sm:w-40"
        />
        <img
          src="/images/blue-flowers-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-6 w-28 rotate-180 opacity-80 mix-blend-multiply select-none sm:w-36"
        />
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">{children}</div>
      </div>
    </div>
  )
}
