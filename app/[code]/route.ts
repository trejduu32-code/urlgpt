import { redirect } from "next/navigation"
import { getUrl } from "@/lib/url-store"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const originalUrl = await getUrl(code)

  if (originalUrl) {
    redirect(originalUrl)
  }

  // If URL not found, redirect to home page
  redirect("/")
}
