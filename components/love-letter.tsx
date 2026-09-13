"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { saveLetterAction, lockAction, type ActionState } from "@/app/actions/letter"
import type { LetterContent, Role } from "@/lib/letter-store"
import { Button } from "@/components/ui/button"

const SIGN_OFF = "With all my love"

export function LoveLetter({ role, content }: { role: Role; content: LetterContent }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [state, formAction, pending] = useActionState<ActionState, FormData>(async (prev, formData) => {
    const result = await saveLetterAction(prev, formData)
    if (!result?.error) {
      setDraft({
        title: String(formData.get("title") ?? "").trim() || "For You, My Love",
        body: String(formData.get("body") ?? "").trim(),
        signature: String(formData.get("signature") ?? "").trim(),
      })
      setIsEditing(false)
    }
    return result
  }, undefined)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }, [isEditing])

  return (
    <article className="relative mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-sm">
        <img
          src="/images/blue-flowers-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 -left-6 w-40 opacity-90 mix-blend-multiply select-none sm:w-52"
        />
        <img
          src="/images/blue-flowers-corner.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-6 w-36 rotate-180 opacity-80 mix-blend-multiply select-none sm:w-44"
        />

        <div className="relative px-6 py-10 sm:px-12 sm:py-14">
          {isEditing ? (
            <form action={formAction} className="flex flex-col gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Title</span>
                <input
                  name="title"
                  defaultValue={draft.title}
                  className="rounded-lg border border-input bg-background px-3 py-2 font-serif text-2xl text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="To my dearest..."
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Your message
                </span>
                <textarea
                  ref={textareaRef}
                  name="body"
                  defaultValue={draft.body}
                  className="min-h-64 resize-none rounded-lg border border-input bg-background px-4 py-3 font-serif text-lg leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Write your heart out..."
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Sign it (your name)
                </span>
                <input
                  name="signature"
                  defaultValue={draft.signature}
                  className="rounded-lg border border-input bg-background px-3 py-2 font-script text-2xl text-primary outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </label>

              {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={pending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving..." : "Save letter"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center">
              <p className="font-script text-3xl text-primary sm:text-4xl">{draft.title}</p>

              <img
                src="/images/blue-flowers-sprig.png"
                alt=""
                aria-hidden="true"
                className="my-5 w-40 select-none mix-blend-multiply sm:w-48"
              />

              <div className="w-full space-y-5 text-pretty text-left font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl">
                {draft.body.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-1">
                <span className="text-sm italic text-muted-foreground">{SIGN_OFF},</span>
                {draft.signature ? <span className="font-script text-3xl text-primary">{draft.signature}</span> : null}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {role === "editor" ? (
                  <Button variant="outline" className="bg-transparent" onClick={() => setIsEditing(true)}>
                    Edit this letter
                  </Button>
                ) : null}
                <form action={lockAction}>
                  <Button type="submit" variant="ghost">
                    Lock
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
