'use client'

import { useState } from 'react'
import Image from 'next/image'
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
      <header style={{ background: 'transparent', paddingBottom: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
          <Image
            src="/images/FloresBoda.png"
            alt="Decoración floral"
            width={260}
            height={120}
            style={{ objectFit: 'contain', width: 'auto', height: '110px' }}
            priority
          />
        </div>
        {/* Línea degradada lila con corazón */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '10px 0 0' }}>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #c4a8d8)' }} />
          <span style={{ fontSize: '0.9rem', color: '#c4a8d8', padding: '0 8px', lineHeight: 1 }}>♥</span>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to left, transparent, #c4a8d8)' }} />
        </div>
      </header>

      {/* ── AMY & JAIR ── */}
      <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
        <h1
          className="font-playfair"
          style={{ fontSize: '2.6rem', fontWeight: 400, letterSpacing: '0.04em', color: '#b5476a', fontStyle: 'italic' }}
        >
          Amy <span style={{ fontWeight: 300, opacity: 0.7, margin: '0 6px' }}>&</span> Jair
        </h1>
      </div>

      {/* ── COUPLE PHOTO ── */}
      {photos.length === 0 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 32px 8px' }}>
          <Image
            src="/images/AmyJair.jpeg"
            alt="Amy y Jair"
            width={280}
            height={360}
            style={{ objectFit: 'cover', borderRadius: '4px', maxHeight: '320px', width: 'auto' }}
          />
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto pb-36">
        {!loading && photos.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '10px 0 8px', textTransform: 'uppercase' }}>
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

      {/* ── FLOATING FOOTER ── */}
      {!lightboxOpen && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '6px 0 8px',
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <Image
            src="/images/camara.jpg"
            alt="Wedding photography"
            width={120}
            height={60}
            style={{ objectFit: 'contain', width: 'auto', height: '52px' }}
          />
        </div>
      )}

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
