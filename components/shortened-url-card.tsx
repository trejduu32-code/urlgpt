"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink, Trash2, Sparkles } from "lucide-react"

interface ShortenedUrlCardProps {
  shortCode: string
  originalUrl: string
  onDelete: () => void
  isCustom?: boolean
}

export function ShortenedUrlCard({ shortCode, originalUrl, onDelete, isCustom }: ShortenedUrlCardProps) {
  const [copied, setCopied] = useState(false)
  const shortUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/s/${shortCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {isCustom && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  Custom
                </span>
              )}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-mono text-sm hover:underline truncate"
              >
                {shortUrl}
              </a>
              <ExternalLink className="h-3 w-3 text-primary shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{originalUrl}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="h-9 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 text-primary" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete shortened URL</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
