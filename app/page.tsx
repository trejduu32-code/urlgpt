import { URLShortener } from "@/components/url-shortener"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#fafafa] flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-[600px]">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#22c55e] to-[#4ade80] bg-clip-text text-transparent">
            URLGPT
          </h1>
          <p className="text-[#71717a] text-sm mt-1">by ExploitZ3r0</p>
        </header>
        <URLShortener />
      </div>
    </main>
  )
}
