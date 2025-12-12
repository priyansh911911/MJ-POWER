export function getImageUrl(file?: string | null): string {
  if (!file) return ''
  if (file.startsWith('http://') || file.startsWith('https://')) return file
  return `${process.env.NEXT_PUBLIC_IMAGES_BASE_URL}${file}`
}

