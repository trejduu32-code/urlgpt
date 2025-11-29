import { UrlShortener } from "@/components/url-shortener"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">URL Shortener</h1>
          <p className="text-muted-foreground text-lg">Transform long URLs into short, shareable links instantly.</p>
        </div>
        <UrlShortener />
      </div>
    </main>
  )
}
