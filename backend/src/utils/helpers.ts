// backend/src/utils/helpers.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function paginate(page: number, limit: number) {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(50, Math.max(1, limit))
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
    page: safePage,
    limit: safeLimit,
  }
}

export function buildResponse<T>(data: T, message?: string) {
  return { success: true, message, data }
}

export function buildError(message: string, statusCode: number = 400) {
  return { success: false, error: message, statusCode }
}
