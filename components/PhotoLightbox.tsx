'use client'

import { useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/types/database'

interface PhotoLightboxProps {
    photos: Photo[]
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
    const photo = photos[currentIndex]
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < photos.length - 1
    const touchStartX = useRef<number | null>(null)

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
        if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
    }, [currentIndex, hasPrev, hasNext, onClose, onNavigate])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [handleKeyDown])

    // Touch / swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        const THRESHOLD = 50
        if (deltaX < -THRESHOLD && hasNext) onNavigate(currentIndex + 1)
        if (deltaX > THRESHOLD && hasPrev) onNavigate(currentIndex - 1)
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(photo.image_url)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `boda-foto-${photo.id.slice(0, 8)}.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch {
            window.open(photo.image_url, '_blank')
        }
    }

    if (!photo) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95" onClick={onClose} />

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
                <div>
                    {photo.uploader_name && (
                        <p className="text-white/90 text-sm font-medium" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                            📸 {photo.uploader_name}
                        </p>
                    )}
                    <p className="text-white/40 text-xs">
                        {currentIndex + 1} de {photos.length}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full text-sm font-medium transition-all border border-white/20 backdrop-blur-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Descargar</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Image */}
            <div
                className="relative w-full h-full flex items-center justify-center p-14 sm:p-16"
                onClick={onClose}
            >
                <div
                    className="relative max-w-5xl max-h-full w-full h-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Image
                        src={photo.image_url}
                        alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto de la boda'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>
            </div>

            {/* Swipe hint on mobile (first visit only) */}
            {photos.length > 1 && (
                <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                    <p className="text-white/30 text-xs">← desliza para navegar →</p>
                </div>
            )}

            {/* Prev */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
                    className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/20 backdrop-blur-sm hover:scale-110 active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Next */}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
                    className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/20 backdrop-blur-sm hover:scale-110 active:scale-95"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Bottom date */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/35 text-xs text-center">
                    {new Date(photo.created_at).toLocaleString('es-MX', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    )
}
