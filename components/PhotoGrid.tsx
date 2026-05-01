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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse" style={{ background: '#f0f0f0', borderRadius: '16px' }} />
                ))}
            </div>
        )
    }

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-28 px-8 text-center gap-4">
                <p className="font-playfair text-2xl italic" style={{ color: 'var(--text)' }}>
                    Sé el primero
                </p>
                <div style={{ width: '32px', height: '1px', background: 'var(--border)' }} />
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
                    Comparte un momento especial del gran día tocando el botón de abajo.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-3">
            {photos.map((photo, index) => (
                <PhotoCard key={photo.id} photo={photo} priority={index < 4} onClick={() => onPhotoClick(index)} />
            ))}
        </div>
    )
}
