"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ShortenedUrlCard } from "@/components/shortened-url-card"
import { LinkIcon, Loader2, Sparkles } from "lucide-react"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: Date
  isCustom?: boolean
  expiresAt: number
}

export function UrlShortener() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])
  const [customSlugUsed, setCustomSlugUsed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    if (shortenedUrls.length >= 11) {
      setError("Maximum 11 links allowed. Please delete a link to add more.")
      return
    }

    if (customSlug.trim()) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
        setError("Custom slug can only contain letters, numbers, hyphens, and underscores")
        return
      }
      if (customSlug.length < 2 || customSlug.length > 20) {
        setError("Custom slug must be 2-20 characters")
        return
      }
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          customSlug: customSlug.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to shorten URL")
      }

      const data = await response.json()

      if (customSlug.trim()) {
        setCustomSlugUsed(true)
      }

      const newShortenedUrl: ShortenedUrl = {
        id: data.id,
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        createdAt: new Date(),
        isCustom: !!customSlug.trim(),
        expiresAt: data.expiresAt,
      }

      setShortenedUrls((prev) => [newShortenedUrl, ...prev])
      setUrl("")
      setCustomSlug("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, shortCode: string, isCustom?: boolean) => {
    try {
      await fetch(`/api/shorten?code=${shortCode}`, {
        method: "DELETE",
      })

      setShortenedUrls((prev) => prev.filter((item) => item.id !== id))

      // Reset custom slug allowance if this was a custom slug
      if (isCustom) {
        setCustomSlugUsed(false)
      }
    } catch (err) {
      console.error("Failed to delete:", err)
      // Still remove from UI even if API fails
      setShortenedUrls((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  customSlugUsed ? "Custom slug already used (1 per person)" : "Custom slug (optional) e.g. 'my-link'"
                }
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                disabled={customSlugUsed}
                className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              {!customSlugUsed && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  1 free custom slug
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten URL"
              )}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <p className="mt-3 text-xs text-muted-foreground text-center">Links expire after 24 hours</p>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Links ({shortenedUrls.length}/11)
          </h2>
          <div className="space-y-3">
            {shortenedUrls.map((item) => (
              <ShortenedUrlCard
                key={item.id}
                shortCode={item.shortCode}
                originalUrl={item.originalUrl}
                onDelete={() => handleDelete(item.id, item.shortCode, item.isCustom)}
                isCustom={item.isCustom}
                expiresAt={item.expiresAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
