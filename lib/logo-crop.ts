/** Crop + resize any logo image to the size used in the sliding clients bar. */

export const LOGO_EXPORT_WIDTH = 800
export const LOGO_EXPORT_HEIGHT = 160
/** Max source file before crop (we resize down automatically). */
export const LOGO_SOURCE_MAX_BYTES = 12 * 1024 * 1024 // 12 MB

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Could not read that image.'))
      img.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Draw the image into a fixed logo-bar frame (cover + pan + zoom). */
export function exportLogoCrop(
  img: HTMLImageElement,
  zoom: number,
  panX: number,
  panY: number,
): { dataUrl: string; width: number; height: number } {
  const canvas = document.createElement('canvas')
  canvas.width = LOGO_EXPORT_WIDTH
  canvas.height = LOGO_EXPORT_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare image.')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const coverScale =
    Math.max(LOGO_EXPORT_WIDTH / img.naturalWidth, LOGO_EXPORT_HEIGHT / img.naturalHeight) * zoom
  const w = img.naturalWidth * coverScale
  const h = img.naturalHeight * coverScale
  const x = (LOGO_EXPORT_WIDTH - w) / 2 + panX
  const y = (LOGO_EXPORT_HEIGHT - h) / 2 + panY

  ctx.drawImage(img, x, y, w, h)

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: LOGO_EXPORT_WIDTH,
    height: LOGO_EXPORT_HEIGHT,
  }
}
