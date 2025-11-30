import { redis } from "./redis"

const URL_PREFIX = "url:"
const CUSTOM_SLUG_PREFIX = "custom_slug_used:"

export async function saveUrl(shortCode: string, originalUrl: string) {
  await redis.set(`${URL_PREFIX}${shortCode}`, originalUrl)
}

export async function getUrl(shortCode: string): Promise<string | null> {
  return await redis.get(`${URL_PREFIX}${shortCode}`)
}

export async function deleteUrl(shortCode: string) {
  await redis.del(`${URL_PREFIX}${shortCode}`)
}

export async function hasUsedCustomSlug(userIdentifier: string): Promise<boolean> {
  const used = await redis.get(`${CUSTOM_SLUG_PREFIX}${userIdentifier}`)
  return used === "true"
}

export async function markCustomSlugUsed(userIdentifier: string) {
  await redis.set(`${CUSTOM_SLUG_PREFIX}${userIdentifier}`, "true")
}
