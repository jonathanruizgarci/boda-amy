'use client'

import { Camera } from 'lucide-react'

interface UploadButtonProps {
    onClick: () => void
    disabled?: boolean
}

export function UploadButton({ onClick, disabled }: UploadButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label="Subir foto"
            className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2.5
        bg-gradient-to-br from-rose-500 to-pink-600
        text-white
        px-5 py-4 rounded-full
        shadow-lg shadow-rose-500/40
        hover:shadow-xl hover:shadow-rose-500/50
        hover:scale-105
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        font-semibold text-sm
        border border-rose-400/30
      "
        >
            <Camera className="w-5 h-5" strokeWidth={2.5} />
            <span>Subir foto</span>
        </button>
    )
}
