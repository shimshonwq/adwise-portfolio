'use client'

import { useEffect, useRef, useState } from 'react'
import {
  LOGO_EXPORT_HEIGHT,
  LOGO_EXPORT_WIDTH,
  LOGO_SOURCE_MAX_BYTES,
  exportLogoCrop,
  loadImageFromFile,
} from '../../lib/logo-crop'
import { LOGO_ACCEPT_ATTR, LOGO_EXT_LABEL, logoMimeOk } from '../../lib/logo-rules'

type Props = {
  disabled?: boolean
  onClear: () => void
  onReady: (file: File | null, preview: { dataUrl: string; width: number; height: number } | null) => void
}

export default function LogoUploadCrop({ disabled, onClear, onReady }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  useEffect(() => {
    if (!img) {
      onReady(file, null)
      return
    }
    try {
      onReady(file, exportLogoCrop(img, zoom, panX, panY))
    } catch {
      onReady(file, null)
    }
  }, [file, img, zoom, panX, panY, onReady])

  const reset = () => {
    setFile(null)
    setImg(null)
    setZoom(1)
    setPanX(0)
    setPanY(0)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear()
  }

  const onPick = async (picked: File | null) => {
    setError(null)
    if (!picked) {
      reset()
      return
    }
    if (!logoMimeOk(picked.type)) {
      setError(`Use ${LOGO_EXT_LABEL} only.`)
      reset()
      return
    }
    if (picked.size > LOGO_SOURCE_MAX_BYTES) {
      setError('That file is very large. Try a photo under 12 MB, or take a screenshot of the logo.')
      reset()
      return
    }
    try {
      const loaded = await loadImageFromFile(picked)
      setFile(picked)
      setImg(loaded)
      setZoom(1)
      setPanX(0)
      setPanY(0)
    } catch {
      setError('Could not open that image. Try another file.')
      reset()
    }
  }

  const preview = img ? exportLogoCrop(img, zoom, panX, panY) : null

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink/70">Logo picture ({LOGO_EXT_LABEL})</span>
        <input
          ref={inputRef}
          type="file"
          accept={LOGO_ACCEPT_ATTR}
          disabled={disabled}
          onChange={(e) => onPick(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        <span className="mt-1 block text-xs text-ink/55">
          Any size is OK — we fit it into the bar for you. Up to 12 MB.
        </span>
      </label>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

      {img && preview && (
        <div className="rounded-xl border border-ink/10 bg-paper p-4">
          <p className="text-sm font-semibold text-ink">Adjust how it looks in the bar</p>
          <p className="mt-1 text-xs text-ink/60">Drag to move · slide to zoom in or out</p>

          <div
            className="relative mt-3 overflow-hidden rounded-lg border border-ink/15 bg-white"
            style={{ width: '100%', maxWidth: 400, aspectRatio: `${LOGO_EXPORT_WIDTH}/${LOGO_EXPORT_HEIGHT}` }}
            onPointerDown={(e) => {
              dragRef.current = { x: e.clientX, y: e.clientY, panX, panY }
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => {
              if (!dragRef.current) return
              const dx = e.clientX - dragRef.current.x
              const dy = e.clientY - dragRef.current.y
              setPanX(dragRef.current.panX + dx)
              setPanY(dragRef.current.panY + dy)
            }}
            onPointerUp={() => {
              dragRef.current = null
            }}
            onPointerCancel={() => {
              dragRef.current = null
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.dataUrl}
              alt="Logo preview"
              className="h-full w-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-ink/70">Zoom</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.05}
              value={zoom}
              disabled={disabled}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={disabled} className="btn btn-secondary text-sm" onClick={() => inputRef.current?.click()}>
              Choose a different picture
            </button>
            <button type="button" disabled={disabled} className="btn btn-secondary text-sm" onClick={reset}>
              Remove picture
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
