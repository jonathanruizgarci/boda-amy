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

  const handleUploadComplete = () => {
    setTimeout(() => refetch(), 800)
  }

  const lightboxOpen = lightboxIndex !== null

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #fff0f5 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(244,114,182,0.15)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="anillo">💍</span>
            <div>
              <h1
                className="text-lg font-bold leading-tight tracking-wide"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  background: 'linear-gradient(135deg, #9f1239 0%, #be185d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Amy &amp; Jonathan
              </h1>
              <p className="text-xs font-medium leading-tight tracking-widest uppercase" style={{ color: '#d4a853', letterSpacing: '0.12em' }}>
                Galería de momentos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(159,18,57,0.04)', borderColor: 'rgba(159,18,57,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#9f1239', opacity: 0.7 }}>En vivo</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto pb-28">
        {!loading && photos.length > 0 && (
          <div className="text-center py-5">
            <p className="text-sm" style={{ color: '#be185d', opacity: 0.7 }}>
              ✨{' '}
              <span className="font-semibold">{photos.length}</span>{' '}
              {photos.length === 1 ? 'foto compartida' : 'fotos compartidas'}
              {' '}&middot; Toca una foto para verla completa
            </p>
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 p-3 rounded-xl text-sm text-center" style={{ background: '#fff1f2', color: '#be185d', border: '1px solid #fecdd3' }}>
            {error}
          </div>
        )}

        <PhotoGrid
          photos={photos}
          loading={loading}
          onPhotoClick={(index) => setLightboxIndex(index)}
        />
      </div>

      {/* FAB — hidden when lightbox is open */}
      {!lightboxOpen && (
        <UploadButton onClick={() => setModalOpen(true)} />
      )}

      <UploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Lightbox */}
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
