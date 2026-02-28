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
            className="group relative overflow-hidden rounded-2xl bg-rose-50/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
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
                {/* Hover overlay with expand icon */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </div>
                </div>
            </div>
            {photo.uploader_name && (
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium truncate drop-shadow-md">
                        📸 {photo.uploader_name}
                    </p>
                </div>
            )}
        </div>
    )
}
