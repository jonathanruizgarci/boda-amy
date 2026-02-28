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
                position: 'fixed', bottom: '24px', right: '20px', zIndex: 50,
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#0a0a0a', color: '#ffffff',
                padding: '13px 22px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s, opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <Camera size={15} strokeWidth={1.8} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subir</span>
        </button>
    )
}
