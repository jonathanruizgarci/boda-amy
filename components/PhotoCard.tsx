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
            className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{ background: 'rgba(253,242,248,0.5)' }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            aria-label={`Ver foto${photo.uploader_name ? ` de ${photo.uploader_name}` : ''} en tamaño completo`}
        >
            <div className="aspect-square relative w-full">
                <Image
                    src={photo.image_url}
                    alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto de la boda'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={priority}
                />
                {/* Elegant hover overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: 'linear-gradient(to top, rgba(159,18,57,0.55) 0%, transparent 60%)' }}
                >
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </div>
                </div>
            </div>

            {photo.uploader_name && (
                <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate drop-shadow" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                        📸 {photo.uploader_name}
                    </p>
                </div>
            )}
        </div>
    )
}
