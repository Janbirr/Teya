"use client"

import { useActionState } from "react"
import { setupAction, type ActionState } from "@/app/actions/letter"
import { Button } from "@/components/ui/button"

export function SetupForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(setupAction, undefined)

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <img
          src="/images/blue-flowers-sprig.png"
          alt=""
          aria-hidden="true"
          className="mb-2 w-36 select-none mix-blend-multiply"
        />
        <h2 className="font-script text-3xl text-primary sm:text-4xl">Set up your letter</h2>
        <p className="mt-2 font-serif text-base text-muted-foreground">
          Create two passwords: one only you use to write and edit, and one to give to her so she can read it.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Your edit password (keep this private)
        </span>
        <input
          name="editPassword"
          type="password"
          autoComplete="new-password"
          className="rounded-lg border border-input bg-background px-3 py-2.5 font-serif text-lg text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Only you know this"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Her reading password (share this with her)
        </span>
        <input
          name="readPassword"
          type="password"
          autoComplete="new-password"
          className="rounded-lg border border-input bg-background px-3 py-2.5 font-serif text-lg text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="The one you give to her"
        />
      </label>

      {state?.error ? <p className="text-center text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Create letter"}
      </Button>
    </form>
  )
}
