"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Copy, ExternalLink, Trash2, Clock, Sparkles, Check } from "lucide-react"

interface ShortenedUrl {
  id: string
  shortCode: string
  originalUrl: string
  expiresAt: number
  isCustomSlug?: boolean
}

export function URLShortener() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [links, setLinks] = useState<ShortenedUrl[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [customSlugUsed, setCustomSlugUsed] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("urlgpt_links")
    if (stored) {
      const parsed = JSON.parse(stored)
      const now = Date.now()
      const valid = parsed.filter((link: ShortenedUrl) => link.expiresAt > now)
      setLinks(valid)
      localStorage.setItem("urlgpt_links", JSON.stringify(valid))
    }
    setCustomSlugUsed(localStorage.getItem("customSlugUsed") === "true")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (links.length >= 11) {
      setError("Maximum 11 links reached. Delete a link to add more.")
      return
    }

    if (customSlug && customSlugUsed) {
      setError("You have already used your 1 free custom slug")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customSlug: customSlug || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      const newLink: ShortenedUrl = {
        id: data.id,
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
        expiresAt: data.expiresAt,
        isCustomSlug: data.isCustomSlug,
      }

      const updated = [newLink, ...links]
      setLinks(updated)
      localStorage.setItem("urlgpt_links", JSON.stringify(updated))

      if (data.isCustomSlug) {
        setCustomSlugUsed(true)
        localStorage.setItem("customSlugUsed", "true")
      }

      setUrl("")
      setCustomSlug("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const deleteLink = async (id: string, shortCode: string) => {
    const link = links.find((l) => l.id === id)

    try {
      await fetch(`/api/shorten?code=${shortCode}`, { method: "DELETE" })
    } catch (e) {
      console.error("Failed to delete:", e)
    }

    if (link?.isCustomSlug) {
      setCustomSlugUsed(false)
      localStorage.setItem("customSlugUsed", "false")
    }

    const updated = links.filter((l) => l.id !== id)
    setLinks(updated)
    localStorage.setItem("urlgpt_links", JSON.stringify(updated))
  }

  const copyLink = async (shortCode: string, id: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`
    await navigator.clipboard.writeText(shortUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Card className="bg-[#18181b] border-[#27272a] p-6 mb-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[#7f1d1d] border border-[#dc2626] text-[#fca5a5] p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Enter URL to shorten</label>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="bg-[#27272a] border-[#3f3f46] text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:ring-[#22c55e]/10"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Custom slug (optional)
              <span
                className={`inline-flex items-center gap-1 text-xs ml-2 ${customSlugUsed ? "text-[#71717a]" : "text-[#facc15]"}`}
              >
                <Sparkles className="w-3 h-3" />
                {customSlugUsed ? "Used" : "1 free"}
              </span>
            </label>
            <Input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder={customSlugUsed ? "Custom slug already used" : "my-custom-link"}
              maxLength={20}
              disabled={customSlugUsed}
              className="bg-[#27272a] border-[#3f3f46] text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:ring-[#22c55e]/10 disabled:opacity-50"
            />
            <p className="text-xs text-[#71717a] mt-1">2-20 characters, letters, numbers, hyphens, underscores only</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-semibold"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>

          <p className="text-center text-xs text-[#71717a] mt-4">Links expire after 24 hours</p>
        </form>
      </Card>

      {links.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Links</h2>
            <span className="text-xs text-[#71717a] bg-[#27272a] px-3 py-1 rounded-full">{links.length} / 11</span>
          </div>

          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={() => deleteLink(link.id, link.shortCode)}
                onCopy={() => copyLink(link.shortCode, link.id)}
                copied={copiedId === link.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function LinkCard({
  link,
  onDelete,
  onCopy,
  copied,
}: {
  link: ShortenedUrl
  onDelete: () => void
  onCopy: () => void
  copied: boolean
}) {
  const [countdown, setCountdown] = useState("")
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const update = () => {
      const remaining = link.expiresAt - Date.now()
      if (remaining <= 0) {
        setCountdown("Expired")
        setExpired(true)
        setTimeout(onDelete, 2000)
        return
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [link.expiresAt, onDelete])

  const shortUrl = typeof window !== "undefined" ? `${window.location.origin}/${link.shortCode}` : `/${link.shortCode}`

  return (
    <div
      className={`bg-[#27272a] border rounded-lg p-4 ${
        link.isCustomSlug ? "border-[#854d0e] bg-gradient-to-r from-[#27272a] to-[#1c1a17]" : "border-[#3f3f46]"
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="font-mono text-sm text-[#4ade80] break-all flex items-center gap-2">
          {shortUrl}
          {link.isCustomSlug && <Sparkles className="w-4 h-4 text-[#facc15]" />}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
              copied
                ? "bg-[#166534] text-[#4ade80]"
                : "bg-[#3f3f46] text-[#a1a1aa] hover:bg-[#52525b] hover:text-[#fafafa]"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-md bg-[#3f3f46] text-[#a1a1aa] hover:bg-[#52525b] hover:text-[#fafafa] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-[#3f3f46] text-[#a1a1aa] hover:bg-[#7f1d1d] hover:text-[#fca5a5] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-[#71717a] break-all mb-2">{link.originalUrl}</p>

      <div className={`text-xs flex items-center gap-1 ${expired ? "text-[#ef4444] animate-pulse" : "text-[#a1a1aa]"}`}>
        <Clock className="w-3 h-3" />
        {countdown}
      </div>
    </div>
  )
}
