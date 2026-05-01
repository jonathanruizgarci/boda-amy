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
            style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#c4a8d8', color: '#000000',
                padding: '12px 22px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 500,
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'transform 0.15s, opacity 0.15s',
                flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <Camera size={15} strokeWidth={1.8} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subir</span>
        </button>
    )
}
