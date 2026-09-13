import "server-only"

import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto"

export type Role = "editor" | "reader"

export type LetterContent = {
  title: string
  body: string
  signature: string
}

const sql = neon(process.env.DATABASE_URL!)

const COOKIE_NAME = "letter_role"

// The session cookie only carries a role; it is signed so it cannot be forged.
// DATABASE_URL is a stable, server-only secret, so we reuse it as the HMAC key.
function sign(value: string) {
  return createHmac("sha256", process.env.DATABASE_URL!).update(value).digest("hex")
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derived = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derived}`
}

function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false
  const [salt, key] = stored.split(":")
  if (!salt || !key) return false
  const derived = scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, "hex")
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}

type LetterRow = {
  title: string
  body: string
  signature: string
  edit_password_hash: string | null
  read_password_hash: string | null
}

async function getRow(): Promise<LetterRow> {
  const rows = (await sql`
    SELECT title, body, signature, edit_password_hash, read_password_hash
    FROM love_letter WHERE id = 1
  `) as LetterRow[]
  return rows[0]
}

export async function isSetupComplete() {
  const row = await getRow()
  return Boolean(row?.edit_password_hash && row?.read_password_hash)
}

export async function setupPasswords(editPassword: string, readPassword: string) {
  await sql`
    UPDATE love_letter
    SET edit_password_hash = ${hashPassword(editPassword)},
        read_password_hash = ${hashPassword(readPassword)}
    WHERE id = 1
  `
}

// Returns the matching role for a password, or null if it matches neither.
export async function roleForPassword(password: string): Promise<Role | null> {
  const row = await getRow()
  if (verifyPassword(password, row.edit_password_hash)) return "editor"
  if (verifyPassword(password, row.read_password_hash)) return "reader"
  return null
}

export async function getLetterContent(): Promise<LetterContent> {
  const row = await getRow()
  return { title: row.title, body: row.body, signature: row.signature }
}

export async function saveLetterContent(content: LetterContent) {
  await sql`
    UPDATE love_letter
    SET title = ${content.title},
        body = ${content.body},
        signature = ${content.signature},
        updated_at = now()
    WHERE id = 1
  `
}

// --- session cookie helpers ---

export async function setRoleCookie(role: Role) {
  const store = await cookies()
  store.set(COOKIE_NAME, `${role}.${sign(role)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function clearRoleCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getCurrentRole(): Promise<Role | null> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return null
  const [role, signature] = raw.split(".")
  if (role !== "editor" && role !== "reader") return null
  if (signature !== sign(role)) return null
  return role
}
