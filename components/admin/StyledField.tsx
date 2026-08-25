import { useState } from 'react'
import {
  FONT_SIZE_OPTIONS,
  type TextStyleOverride,
} from '../../lib/content'
import { BODY_FONTS, DISPLAY_FONTS, SERIF_FONTS } from '../../lib/fonts'

const ALL_FONTS = [
  { id: '', label: 'Default (theme)' },
  ...DISPLAY_FONTS.filter((f) => f.id !== 'custom').map((f) => ({
    id: f.stack,
    label: `Display: ${f.label}`,
  })),
  ...BODY_FONTS.filter((f) => f.id !== 'custom' && f.id !== 'system').map((f) => ({
    id: f.stack,
    label: `Body: ${f.label}`,
  })),
  ...SERIF_FONTS.filter((f) => f.id !== 'custom').map((f) => ({
    id: f.stack,
    label: `Accent: ${f.label}`,
  })),
]

export function StyledField({
  label,
  path,
  value,
  onChange,
  style,
  onStyleChange,
  multiline,
  hint,
}: {
  label: string
  path: string
  value: string
  onChange: (v: string) => void
  style?: TextStyleOverride
  onStyleChange: (path: string, style: TextStyleOverride | undefined) => void
  multiline?: boolean
  hint?: string
}) {
  const [open, setOpen] = useState(false)
  const s = style || {}
  const cls =
    'w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-brand'

  const set = (patch: Partial<TextStyleOverride>) => {
    const next = { ...s, ...patch }
    const empty = !next.fontFamily && !next.fontSize && !next.fontWeight && !next.color && !next.fontStyle
    onStyleChange(path, empty ? undefined : next)
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white/80 p-3">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink/70">{label}</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded border border-ink/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/55 hover:border-ink/30 hover:text-ink"
        >
          {open ? 'Hide style' : 'Text style'}
        </button>
      </div>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
      {open && (
        <div className="mt-3 grid gap-2 rounded-lg bg-paper/80 p-3 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-ink/60">Font</span>
            <select
              className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm"
              value={s.fontFamily || ''}
              onChange={(e) => set({ fontFamily: e.target.value || undefined })}
            >
              {ALL_FONTS.map((f) => (
                <option key={f.id || 'default'} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-ink/60">Size</span>
            <select
              className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm"
              value={s.fontSize || ''}
              onChange={(e) => set({ fontSize: e.target.value || undefined })}
            >
              {FONT_SIZE_OPTIONS.map((f) => (
                <option key={f.id || 'def'} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-ink/60">Weight</span>
            <select
              className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm"
              value={s.fontWeight || ''}
              onChange={(e) => set({ fontWeight: e.target.value || undefined })}
            >
              <option value="">Default</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
              <option value="800">Extra bold</option>
            </select>
          </label>
          <label className="block text-xs">
            <span className="mb-1 block font-medium text-ink/60">Color</span>
            <span className="flex gap-2">
              <input
                type="color"
                value={s.color && s.color.startsWith('#') ? s.color : '#14130f'}
                onChange={(e) => set({ color: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded border border-ink/15"
              />
              <input
                type="text"
                placeholder="#14130f or leave blank"
                value={s.color || ''}
                onChange={(e) => set({ color: e.target.value || undefined })}
                className="min-w-0 flex-1 rounded border border-ink/15 bg-white px-2 py-1.5 font-mono text-xs"
              />
            </span>
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="mb-1 block font-medium text-ink/60">Style</span>
            <select
              className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-sm"
              value={s.fontStyle || ''}
              onChange={(e) => set({ fontStyle: e.target.value || undefined })}
            >
              <option value="">Default</option>
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </label>
          <button
            type="button"
            className="btn btn-secondary !py-1.5 text-xs sm:col-span-2"
            onClick={() => onStyleChange(path, undefined)}
          >
            Clear text style for this field
          </button>
        </div>
      )}
    </div>
  )
}
