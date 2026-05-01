'use client'

import Image from 'next/image'
import type { Photo } from '@/types/database'

interface PhotoCardProps {
    photo: Photo
    priority?: boolean
    onClick?: () => void
}

export function PhotoCard({ photo, priority = false, onClick }: PhotoCardProps) {
    return (
        <div
            className="group relative overflow-hidden cursor-pointer"
            style={{ background: '#f0f0f0', aspectRatio: '1', borderRadius: '16px' }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            aria-label={`Ver foto${photo.uploader_name ? ` de ${photo.uploader_name}` : ''}`}
        >
            <Image
                src={photo.image_url}
                alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto de la boda'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
            />
            {/* Hover overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }}
            >
                {photo.uploader_name && (
                    <p
                        className="font-playfair absolute bottom-2.5 left-3 right-3 text-xs italic truncate"
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                        {photo.uploader_name}
                    </p>
                )}
            </div>
        </div>
    )
}
