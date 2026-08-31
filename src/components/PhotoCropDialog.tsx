import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { useUiLang } from '../lib/i18n'

// Fixed 4:5 viewport. Kept in pixels so pointer/pan math is exact.
const VIEW_W = 300
const VIEW_H = 375
const MIN_ZOOM = 1 // 1 = image exactly covers the viewport (no letterboxing)
const MAX_ZOOM = 3
const TOP_BIAS = 0.35 // default crop sits slightly above centre to keep faces in frame
const MAX_OUTPUT = 800

interface PhotoCropDialogProps {
  open: boolean
  src: string | null
  onClose: () => void
  onApply: (dataUrl: string) => void
}

export default function PhotoCropDialog({ open, src, onClose, onApply }: PhotoCropDialogProps) {
  const { t } = useUiLang()

  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  // Normalised centre of the visible crop window within the image (0..1).
  const [cx, setCx] = useState(0.5)
  const [cy, setCy] = useState(0.5)
  const [dragging, setDragging] = useState(false)

  const imgRef = useRef<HTMLImageElement>(null)
  const initedRef = useRef(false)
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)

  // Reset state each time a new image opens.
  useEffect(() => {
    initedRef.current = false
    setNatural({ w: 0, h: 0 })
    setZoom(1)
    setCx(0.5)
    setCy(0.5)
    setDragging(false)
  }, [open, src])

  const cover = natural.w && natural.h ? Math.max(VIEW_W / natural.w, VIEW_H / natural.h) : 0
  const dw = natural.w * cover * zoom
  const dh = natural.h * cover * zoom

  const clampCx = (v: number, width: number) =>
    width > 0 ? Math.min(1 - VIEW_W / (2 * width), Math.max(VIEW_W / (2 * width), v)) : 0.5
  const clampCy = (v: number, height: number) =>
    height > 0 ? Math.min(1 - VIEW_H / (2 * height), Math.max(VIEW_H / (2 * height), v)) : 0.5

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const w = e.currentTarget.naturalWidth
    const h = e.currentTarget.naturalHeight
    if (!w || !h) return
    setNatural({ w, h })
    if (!initedRef.current) {
      initedRef.current = true
      const c = Math.max(VIEW_W / w, VIEW_H / h)
      const dh0 = h * c
      // For tall images, bias the default window toward the top (faces live
      // above centre) instead of dead-centring. Wide images stay centred.
      const cy0 = dh0 > VIEW_H ? (1 - VIEW_H / dh0) * TOP_BIAS + VIEW_H / (2 * dh0) : 0.5
      setCy(cy0)
    }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, y: e.clientY, cx, cy }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || !dw || !dh) return
    const nx = clampCx(d.cx - (e.clientX - d.x) / dw, dw)
    const ny = clampCy(d.cy - (e.clientY - d.y) / dh, dh)
    setCx(nx)
    setCy(ny)
  }

  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  const onZoom = (_e: unknown, value: number | number[]) => {
    const z = Array.isArray(value) ? value[0] : value
    const nextDw = natural.w * cover * z
    const nextDh = natural.h * cover * z
    setZoom(z)
    setCx((c) => clampCx(c, nextDw))
    setCy((c) => clampCy(c, nextDh))
  }

  const apply = () => {
    const img = imgRef.current
    if (!img || !natural.w || !natural.h || !dw || !dh) return
    const offsetX = VIEW_W / 2 - cx * dw
    const offsetY = VIEW_H / 2 - cy * dh
    // Map the visible viewport back to source-image coordinates.
    const sx = -offsetX * (natural.w / dw)
    const sy = -offsetY * (natural.h / dh)
    const sw = VIEW_W * (natural.w / dw)
    const sh = VIEW_H * (natural.h / dh)
    const scale = Math.min(1, MAX_OUTPUT / Math.max(sw, sh))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw * scale))
    canvas.height = Math.max(1, Math.round(sh * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    onApply(canvas.toDataURL('image/jpeg', 0.85))
  }

  const offsetX = VIEW_W / 2 - cx * dw
  const offsetY = VIEW_H / 2 - cy * dh

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('adjustPhoto')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            sx={{
              position: 'relative',
              width: VIEW_W,
              height: VIEW_H,
              overflow: 'hidden',
              borderRadius: 2,
              bgcolor: '#000',
              border: 1,
              borderColor: 'divider',
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            {src && (
              <img
                ref={imgRef}
                src={src}
                alt=""
                draggable={false}
                onLoad={handleImageLoad}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  position: 'absolute',
                  left: offsetX,
                  top: offsetY,
                  width: dw,
                  height: dh,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}
            {/* rule-of-thirds guides */}
            {[1, 2].map((n) => (
              <Box
                key={`v${n}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${(n * 100) / 3}%`,
                  width: '1px',
                  bgcolor: 'rgba(255,255,255,0.14)',
                  pointerEvents: 'none',
                }}
              />
            ))}
            {[1, 2].map((n) => (
              <Box
                key={`h${n}`}
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(n * 100) / 3}%`,
                  height: '1px',
                  bgcolor: 'rgba(255,255,255,0.14)',
                  pointerEvents: 'none',
                }}
              />
            ))}
            {/* crop frame */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                border: '1px solid rgba(255,255,255,0.55)',
                borderRadius: 2,
                pointerEvents: 'none',
              }}
            />
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'center' }}>
            <ZoomOutIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Slider
              aria-label={t('zoom')}
              value={zoom}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              onChange={onZoom}
              size="small"
              disabled={!natural.w}
            />
            <ZoomInIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {t('dragToReposition')}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button variant="contained" onClick={apply} disabled={!natural.w}>
          {t('apply')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
