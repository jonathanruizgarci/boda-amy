'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/types/database'

interface PhotoLightboxProps {
    photos: Photo[]
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

function getPinchDistance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
    const photo = photos[currentIndex]
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < photos.length - 1

    // Zoom state
    const [zoom, setZoom] = useState(1)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)

    // Touch refs
    const touchStartX = useRef<number | null>(null)
    const pinchStartDist = useRef<number | null>(null)
    const pinchStartZoom = useRef(1)
    const lastTap = useRef(0)
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
    const isPanning = useRef(false)

    // Reset zoom when photo changes
    useEffect(() => {
        setZoom(1); setPanX(0); setPanY(0)
    }, [currentIndex])

    // Keyboard
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
        if (zoom === 1) {
            if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
            if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
        }
    }, [currentIndex, hasPrev, hasNext, onClose, onNavigate, zoom])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [handleKeyDown])

    // Double-tap to zoom
    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        const now = Date.now()
        if (now - lastTap.current < 300) {
            if (zoom > 1) { setZoom(1); setPanX(0); setPanY(0) }
            else setZoom(2.5)
        }
        lastTap.current = now
    }

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            pinchStartDist.current = getPinchDistance(e.touches[0].clientX, e.touches[0].clientY, e.touches[1].clientX, e.touches[1].clientY)
            pinchStartZoom.current = zoom
            isPanning.current = false
        } else if (e.touches.length === 1) {
            const t = e.touches[0]
            if (zoom > 1) {
                dragStart.current = { x: t.clientX, y: t.clientY, panX, panY }
                isPanning.current = true
            } else {
                touchStartX.current = t.clientX
                isPanning.current = false
            }
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && pinchStartDist.current !== null) {
            e.preventDefault()
            const dist = getPinchDistance(e.touches[0].clientX, e.touches[0].clientY, e.touches[1].clientX, e.touches[1].clientY)
            const next = Math.min(4, Math.max(1, pinchStartZoom.current * (dist / pinchStartDist.current)))
            setZoom(next)
            if (next <= 1) { setPanX(0); setPanY(0) }
        } else if (isPanning.current && e.touches.length === 1 && zoom > 1) {
            e.preventDefault()
            const dx = e.touches[0].clientX - dragStart.current.x
            const dy = e.touches[0].clientY - dragStart.current.y
            setPanX(dragStart.current.panX + dx)
            setPanY(dragStart.current.panY + dy)
        }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) pinchStartDist.current = null
        if (e.touches.length === 0 && !isPanning.current && zoom <= 1 && touchStartX.current !== null) {
            const deltaX = e.changedTouches[0].clientX - touchStartX.current
            if (deltaX < -50 && hasNext) onNavigate(currentIndex + 1)
            else if (deltaX > 50 && hasPrev) onNavigate(currentIndex - 1)
            touchStartX.current = null
        }
        if (e.touches.length === 0) isPanning.current = false
    }

    const handleDownload = async () => {
        try {
            const res = await fetch(photo.image_url)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = `boda-${photo.id.slice(0, 8)}.jpg`
            document.body.appendChild(a); a.click()
            document.body.removeChild(a); URL.revokeObjectURL(url)
        } catch { window.open(photo.image_url, '_blank') }
    }

    if (!photo) return null

    const isZoomed = zoom > 1

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#000' }}>

            {/* Top controls */}
            <div
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
            >
                <div>
                    {photo.uploader_name && (
                        <p className="font-playfair text-sm italic" style={{ color: 'rgba(255,255,255,0.85)' }}>
                            {photo.uploader_name}
                        </p>
                    )}
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                        {currentIndex + 1} / {photos.length}
                        {isZoomed && '  · doble toque para restablecer'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                            color: '#fff', borderRadius: '100px', padding: '7px 14px',
                            fontSize: '0.75rem', cursor: 'pointer', backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Download size={13} />
                        <span className="hidden sm:inline">Descargar</span>
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                            color: '#fff', borderRadius: '100%', padding: '8px',
                            cursor: 'pointer', backdropFilter: 'blur(8px)',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Full-screen image with zoom and pan */}
            <div
                className="absolute inset-0"
                style={{ cursor: isZoomed ? 'grab' : 'zoom-in', touchAction: 'none' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={zoom === 1 ? onClose : undefined}
            >
                <div
                    style={{
                        position: 'absolute', inset: 0,
                        transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                        transition: isPanning.current ? 'none' : 'transform 0.2s ease',
                        willChange: 'transform',
                    }}
                    onClick={handleImageClick}
                >
                    <Image
                        src={photo.image_url}
                        alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto de la boda'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                        draggable={false}
                    />
                </div>
            </div>

            {/* Prev button — overlaid on left side of image */}
            {hasPrev && !isZoomed && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
                    style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 20, background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100%',
                        padding: '10px', color: '#fff', cursor: 'pointer',
                        backdropFilter: 'blur(8px)', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
            )}

            {/* Next button — overlaid on right side of image */}
            {hasNext && !isZoomed && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
                    style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        zIndex: 20, background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100%',
                        padding: '10px', color: '#fff', cursor: 'pointer',
                        backdropFilter: 'blur(8px)', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                    <ChevronRight size={22} strokeWidth={1.5} />
                </button>
            )}

            {/* Swipe hint */}
            {photos.length > 1 && !isZoomed && (
                <p style={{
                    position: 'absolute', bottom: '16px', left: 0, right: 0,
                    textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.08em', pointerEvents: 'none',
                }}>
                </p>
            )}
        </div>
    )
}
