import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { saveUrl, getUrl, deleteUrl, hasUsedCustomSlug, markCustomSlugUsed } from "@/lib/url-store"

function generateShortCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length >= 2 && slug.length <= 20
}

async function getUserIdentifier(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")
  const ip = forwarded?.split(",")[0] || realIp || "unknown"
  return ip.trim()
}

export async function POST(request: Request) {
  const { url, customSlug } = await request.json()

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  let urlToShorten = url
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    urlToShorten = `https://${url}`
  }

  if (!isValidUrl(urlToShorten)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  let shortCode: string
  const userIdentifier = await getUserIdentifier()

  if (customSlug && typeof customSlug === "string") {
    if (!isValidSlug(customSlug)) {
      return NextResponse.json(
        { error: "Custom slug must be 2-20 characters and contain only letters, numbers, hyphens, and underscores" },
        { status: 400 },
      )
    }

    const alreadyUsed = await hasUsedCustomSlug(userIdentifier)
    if (alreadyUsed) {
      return NextResponse.json({ error: "You have already used your 1 free custom slug" }, { status: 403 })
    }

    const existingUrl = await getUrl(customSlug)
    if (existingUrl) {
      return NextResponse.json({ error: "This custom slug is already taken" }, { status: 409 })
    }

    shortCode = customSlug
    await saveUrl(shortCode, urlToShorten, true, userIdentifier)
    await markCustomSlugUsed(userIdentifier)
  } else {
    shortCode = generateShortCode()
    await saveUrl(shortCode, urlToShorten, false)
  }

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000

  return NextResponse.json({
    id: crypto.randomUUID(),
    shortCode,
    originalUrl: urlToShorten,
    expiresAt,
    isCustomSlug: !!customSlug,
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 })
  }

  await deleteUrl(code)
  return NextResponse.json({ success: true })
}
