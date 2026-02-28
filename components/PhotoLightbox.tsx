'use client'

import { useEffect, useCallback } from 'react'
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
            // Fallback: open in new tab
            window.open(photo.image_url, '_blank')
        }
    }

    if (!photo) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Controls top bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    {photo.uploader_name && (
                        <span className="text-white/80 text-sm font-medium">
                            📸 {photo.uploader_name}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/50 text-xs">
                        {currentIndex + 1} / {photos.length}
                    </span>
                    {/* Download button */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-white/20"
                        title="Descargar foto"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Descargar</span>
                    </button>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center p-14 sm:p-16">
                <div className="relative max-w-5xl max-h-full w-full h-full">
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

            {/* Prev button */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
                    className="absolute left-2 sm:left-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/20 hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Next button */}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
                    className="absolute right-2 sm:right-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/20 hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Bottom gradient with date */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/40 text-xs text-center">
                    {new Date(photo.created_at).toLocaleString('es-MX', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    )
}
