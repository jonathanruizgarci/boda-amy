'use client'

import { useState } from 'react'
import { usePhotos } from '@/hooks/usePhotos'
import { PhotoGrid } from '@/components/PhotoGrid'
import { UploadButton } from '@/components/UploadButton'
import { UploadModal } from '@/components/UploadModal'
import { PhotoLightbox } from '@/components/PhotoLightbox'

export default function Home() {
  const { photos, loading, error, refetch } = usePhotos()
  const [modalOpen, setModalOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleUploadComplete = () => setTimeout(() => refetch(), 800)
  const lightboxOpen = lightboxIndex !== null

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto px-5" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Names — elegant serif */}
          <div style={{ lineHeight: 1 }}>
            <h1
              className="font-playfair"
              style={{ fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.03em', color: 'var(--text)', fontStyle: 'italic' }}
            >
              Amy <span style={{ fontStyle: 'normal', fontWeight: 300, opacity: 0.35, margin: '0 4px' }}>&</span> Jair
            </h1>
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>En vivo</span>
          </div>
        </div>
      </header>

      {/* ── THIN RULE ── */}
      <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto pb-28">
        {!loading && photos.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '18px 0 8px', textTransform: 'uppercase' }}>
            {photos.length} {photos.length === 1 ? 'momento' : 'momentos'} · toca para ampliar
          </p>
        )}

        {error && (
          <div style={{ margin: '12px 16px', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <PhotoGrid photos={photos} loading={loading} onPhotoClick={(i) => setLightboxIndex(i)} />
      </div>

      {!lightboxOpen && <UploadButton onClick={() => setModalOpen(true)} />}

      <UploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onUploadComplete={handleUploadComplete} />

      {lightboxOpen && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex!}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </main>
  )
}
