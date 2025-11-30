import { redis } from "./redis"

const URL_PREFIX = "url:"
const CUSTOM_SLUG_PREFIX = "custom_slug_used:"
const URL_TTL_SECONDS = 24 * 60 * 60

export async function saveUrl(shortCode: string, originalUrl: string, isCustomSlug = false, userIdentifier?: string) {
  const data = {
    url: originalUrl,
    expiresAt: Date.now() + URL_TTL_SECONDS * 1000,
    isCustomSlug,
    userIdentifier: isCustomSlug ? userIdentifier : undefined,
  }
  await redis.set(`${URL_PREFIX}${shortCode}`, JSON.stringify(data), { ex: URL_TTL_SECONDS })
}

export async function getUrl(
  shortCode: string,
): Promise<{ url: string; expiresAt: number; isCustomSlug?: boolean; userIdentifier?: string } | null> {
  const data = await redis.get(`${URL_PREFIX}${shortCode}`)
  if (!data) return null

  if (typeof data === "string" && !data.startsWith("{")) {
    return { url: data, expiresAt: Date.now() + URL_TTL_SECONDS * 1000 }
  }

  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data
    return parsed
  } catch {
    return { url: data as string, expiresAt: Date.now() + URL_TTL_SECONDS * 1000 }
  }
}

export async function deleteUrl(shortCode: string) {
  const data = await getUrl(shortCode)
  if (data?.isCustomSlug && data?.userIdentifier) {
    await resetCustomSlugUsed(data.userIdentifier)
  }
  await redis.del(`${URL_PREFIX}${shortCode}`)
}

export async function hasUsedCustomSlug(userIdentifier: string): Promise<boolean> {
  const used = await redis.get(`${CUSTOM_SLUG_PREFIX}${userIdentifier}`)
  return used === "true"
}

export async function markCustomSlugUsed(userIdentifier: string) {
  await redis.set(`${CUSTOM_SLUG_PREFIX}${userIdentifier}`, "true")
}

export async function resetCustomSlugUsed(userIdentifier: string) {
  await redis.del(`${CUSTOM_SLUG_PREFIX}${userIdentifier}`)
}
