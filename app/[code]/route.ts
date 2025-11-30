import { redirect } from "next/navigation"
import { getUrl } from "@/lib/url-store"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const urlData = await getUrl(code)

  if (urlData && urlData.url) {
    redirect(urlData.url)
  }

  // If URL not found or expired, redirect to home page
  redirect("/")
}
