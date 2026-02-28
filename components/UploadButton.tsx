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
        text-white
        px-5 py-4 rounded-full
        hover:scale-105
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        font-semibold text-sm
      "
            style={{
                background: 'linear-gradient(135deg, #9f1239 0%, #be185d 60%, #db2777 100%)',
                boxShadow: '0 8px 32px rgba(159,18,57,0.45), 0 2px 8px rgba(159,18,57,0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'var(--font-geist), sans-serif',
                letterSpacing: '0.01em',
            }}
        >
            <Camera className="w-5 h-5" strokeWidth={2} />
            <span>Subir foto</span>
        </button>
    )
}
