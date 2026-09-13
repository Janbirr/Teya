"use client"

import { useActionState } from "react"
import { unlockAction, type ActionState } from "@/app/actions/letter"
import { Button } from "@/components/ui/button"

export function UnlockForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(unlockAction, undefined)

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/blue-flowers-sprig.png"
          alt=""
          aria-hidden="true"
          className="mb-2 w-36 select-none mix-blend-multiply"
        />
        <h2 className="font-script text-3xl text-primary sm:text-4xl">A letter awaits you</h2>
        <p className="mt-2 font-serif text-base text-muted-foreground">
          Enter your password to open the letter.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="rounded-lg border border-input bg-background px-3 py-2.5 text-center font-serif text-lg text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
          autoFocus
        />
      </label>

      {state?.error ? <p className="text-center text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Opening..." : "Open the letter"}
      </Button>
    </form>
  )
}
