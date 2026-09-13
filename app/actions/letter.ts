"use server"

import { revalidatePath } from "next/cache"
import {
  isSetupComplete,
  setupPasswords,
  roleForPassword,
  saveLetterContent,
  getCurrentRole,
  setRoleCookie,
  clearRoleCookie,
} from "@/lib/letter-store"

export type ActionState = { error?: string } | undefined

export async function setupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (await isSetupComplete()) {
    return { error: "This letter is already set up." }
  }

  const editPassword = String(formData.get("editPassword") ?? "")
  const readPassword = String(formData.get("readPassword") ?? "")

  if (editPassword.length < 4 || readPassword.length < 4) {
    return { error: "Each password must be at least 4 characters." }
  }
  if (editPassword === readPassword) {
    return { error: "Your edit and reading passwords must be different." }
  }

  await setupPasswords(editPassword, readPassword)
  await setRoleCookie("editor")
  revalidatePath("/")
  return undefined
}

export async function unlockAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "")
  if (!password) return { error: "Please enter a password." }

  const role = await roleForPassword(password)
  if (!role) return { error: "That password does not match. Please try again." }

  await setRoleCookie(role)
  revalidatePath("/")
  return undefined
}

export async function saveLetterAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const role = await getCurrentRole()
  if (role !== "editor") {
    return { error: "You do not have permission to edit this letter." }
  }

  const title = String(formData.get("title") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()
  const signature = String(formData.get("signature") ?? "").trim()

  if (!body) return { error: "The message cannot be empty." }

  await saveLetterContent({
    title: title || "For You, My Love",
    body,
    signature,
  })
  revalidatePath("/")
  return undefined
}

export async function lockAction() {
  await clearRoleCookie()
  revalidatePath("/")
}
