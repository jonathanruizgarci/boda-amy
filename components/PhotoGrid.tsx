'use client'

import { PhotoCard } from '@/components/PhotoCard'
import type { Photo } from '@/types/database'

interface PhotoGridProps {
    photos: Photo[]
    loading: boolean
}

export function PhotoGrid({ photos, loading }: PhotoGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-2xl bg-rose-100/40 animate-pulse"
                    />
                ))}
            </div>
        )
    }

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">💍</div>
                <h2 className="text-2xl font-semibold text-rose-400 mb-2">¡Sé el primero!</h2>
                <p className="text-slate-400 text-sm max-w-xs">
                    Aún no hay fotos. Toca el botón de abajo y comparte un momento especial del gran día.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-4">
            {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
            ))}
        </div>
    )
}
