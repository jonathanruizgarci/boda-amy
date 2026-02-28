'use client'

import type { Photo } from '@/types/database'
import { PhotoCard } from '@/components/PhotoCard'

interface PhotoGridProps {
    photos: Photo[]
    loading: boolean
    onPhotoClick: (index: number) => void
}

export function PhotoGrid({ photos, loading, onPhotoClick }: PhotoGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ background: 'rgba(244,114,182,0.12)' }} />
                ))}
            </div>
        )
    }

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">💍</div>
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: '#be185d' }}
                >
                    ¡Sé el primero!
                </h2>
                <p className="text-sm max-w-xs" style={{ color: '#9ca3af' }}>
                    Aún no hay fotos. Toca el botón de abajo y comparte un momento especial del gran día.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-4">
            {photos.map((photo, index) => (
                <PhotoCard
                    key={photo.id}
                    photo={photo}
                    priority={index < 4}
                    onClick={() => onPhotoClick(index)}
                />
            ))}
        </div>
    )
}
