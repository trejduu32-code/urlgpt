import { redis } from "./redis"

const URL_PREFIX = "url:"

export async function saveUrl(shortCode: string, originalUrl: string) {
  await redis.set(`${URL_PREFIX}${shortCode}`, originalUrl)
}

export async function getUrl(shortCode: string): Promise<string | null> {
  return await redis.get(`${URL_PREFIX}${shortCode}`)
}

export async function deleteUrl(shortCode: string) {
  await redis.del(`${URL_PREFIX}${shortCode}`)
}
