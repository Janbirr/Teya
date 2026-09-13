"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const DEFAULT_TITLE = "To My Dearest"

const DEFAULT_MESSAGE = `From the very first moment I saw you, I knew my life was about to change in the most beautiful way. You walked in like the first warm morning after a long winter, and somehow everything felt softer, brighter, and more alive.

I love the little things about you — the way you laugh at your own jokes before you finish them, the way your eyes light up when you talk about the things you love, and the way you make even the most ordinary days feel like something worth remembering.

You are my calm in every storm, my favorite hello and my hardest goodbye. When I am with you, I am exactly where I am meant to be. You make me want to be braver, kinder, and better in every way.

These blue flowers are for you — quiet, gentle, and endless, just like the way I will always love you. No matter where life takes us, my heart will keep choosing you, again and again.

Thank you for being you. Thank you for being mine.

Forever and always,
Yours`

const SIGN_OFF = "With all my love"

export function LoveLetter() {
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const [signature, setSignature] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load any previously saved letter from this browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("love-letter")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.message) setMessage(parsed.message)
        if (typeof parsed.signature === "string") setSignature(parsed.signature)
      }
    } catch {
      // ignore malformed storage
    }
  }, [])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }, [isEditing, message])

  function handleSave() {
    try {
      localStorage.setItem("love-letter", JSON.stringify({ title, message, signature }))
    } catch {
      // ignore storage errors
    }
    setIsEditing(false)
  }

  return (
    <article className="relative mx-auto w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-sm">
        {/* corner flowers */}
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
            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-64 resize-none rounded-lg border border-input bg-background px-4 py-3 font-serif text-lg leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Write your heart out..."
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Sign it (your name)
                </span>
                <input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 font-script text-2xl text-primary outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </label>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save letter</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <p className="font-script text-3xl text-primary sm:text-4xl">{title}</p>

              <img
                src="/images/blue-flowers-sprig.png"
                alt=""
                aria-hidden="true"
                className="my-5 w-40 select-none mix-blend-multiply sm:w-48"
              />

              <div className="w-full space-y-5 text-pretty text-left font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl">
                {message.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-1">
                <span className="text-sm italic text-muted-foreground">{SIGN_OFF},</span>
                {signature ? <span className="font-script text-3xl text-primary">{signature}</span> : null}
              </div>

              <Button variant="outline" className="mt-10 bg-transparent" onClick={() => setIsEditing(true)}>
                Edit this letter
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
