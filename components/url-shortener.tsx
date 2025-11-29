"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ShortenedUrlCard } from "@/components/shortened-url-card"
import { LinkIcon, Loader2 } from "lucide-react"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: Date
}

export function UrlShortener() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([])

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const generateShortCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to shorten URL")
      }

      const data = await response.json()

      const newShortenedUrl: ShortenedUrl = {
        id: data.id,
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        createdAt: new Date(),
      }

      setShortenedUrls((prev) => [newShortenedUrl, ...prev])
      setUrl("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setShortenedUrls((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
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
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Links</h2>
          <div className="space-y-3">
            {shortenedUrls.map((item) => (
              <ShortenedUrlCard
                key={item.id}
                shortCode={item.shortCode}
                originalUrl={item.originalUrl}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
