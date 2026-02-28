'use client'

import Image from 'next/image'
import type { Photo } from '@/types/database'

interface PhotoCardProps {
    photo: Photo
}

export function PhotoCard({ photo }: PhotoCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-rose-50/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-square relative w-full">
                <Image
                    src={photo.image_url}
                    alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto de la boda'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
