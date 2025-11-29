import { NextResponse } from "next/server"
import { saveUrl } from "@/lib/url-store"

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

export async function POST(request: Request) {
  const { url } = await request.json()

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

  const shortCode = generateShortCode()
  await saveUrl(shortCode, urlToShorten)

  return NextResponse.json({
    id: crypto.randomUUID(),
    shortCode,
    originalUrl: urlToShorten,
  })
}
