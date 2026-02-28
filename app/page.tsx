'use client'

import { useState } from 'react'
import { usePhotos } from '@/hooks/usePhotos'
import { PhotoGrid } from '@/components/PhotoGrid'
import { UploadButton } from '@/components/UploadButton'
import { UploadModal } from '@/components/UploadModal'

export default function Home() {
  const { photos, loading, error } = usePhotos()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-rose-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">
                Nuestra Boda
              </h1>
              <p className="text-xs text-rose-400 font-medium leading-tight">
                Galería de momentos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium">En vivo</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto pb-28">
        {/* Photo count banner */}
        {!loading && photos.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400">
              ✨{' '}
              <span className="font-semibold text-rose-500">{photos.length}</span>{' '}
              {photos.length === 1 ? 'foto compartida' : 'fotos compartidas'}
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <PhotoGrid photos={photos} loading={loading} />
      </div>

      {/* Floating Upload Button */}
      <UploadButton onClick={() => setModalOpen(true)} />

      {/* Upload Modal */}
      <UploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
