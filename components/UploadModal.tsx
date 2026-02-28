'use client'

import { useRef, useState, useEffect } from 'react'
import { X, ImagePlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { usePhotoUpload } from '@/hooks/usePhotoUpload'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUploadComplete?: () => void
}

interface FilePreview {
    file: File
    previewUrl: string
    status: 'pending' | 'uploading' | 'done' | 'error'
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<FilePreview[]>([])
    const [uploaderName, setUploaderName] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const { upload, reset } = usePhotoUpload()

    useEffect(() => {
        if (allDone) {
            const t = setTimeout(() => handleClose(), 2200)
            return () => clearTimeout(t)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDone])

    const handleClose = () => {
        if (isUploading) return
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        setFiles([]); setUploaderName(''); setIsUploading(false)
        setAllDone(false); setCurrentIndex(0); reset(); onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (!selected.length) return
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        setFiles(selected.map(file => ({ file, previewUrl: URL.createObjectURL(file), status: 'pending' as const })))
        setAllDone(false); setCurrentIndex(0); reset()
    }

    const handleUpload = async () => {
        if (!files.length || isUploading) return
        setIsUploading(true)
        const updated = [...files]
        let successCount = 0
        for (let i = 0; i < updated.length; i++) {
            setCurrentIndex(i)
            updated[i] = { ...updated[i], status: 'uploading' }
            setFiles([...updated])
            const ok = await upload(updated[i].file, uploaderName)
            updated[i] = { ...updated[i], status: ok ? 'done' : 'error' }
            if (ok) successCount++
            setFiles([...updated]); reset()
        }
        setIsUploading(false); setAllDone(true)
        if (successCount > 0) onUploadComplete?.()
    }

    const doneCount = files.filter(f => f.status === 'done').length

    if (!isOpen) return null

    const statusColor = { pending: 'transparent', uploading: 'rgba(0,0,0,0.45)', done: 'rgba(10,10,10,0.55)', error: 'rgba(200,40,40,0.45)' }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} />

            {/* Modal */}
            <div
                className="relative w-full sm:max-w-sm flex flex-col animate-slide-up"
                style={{
                    background: '#fff',
                    borderRadius: '20px 20px 0 0',
                    maxHeight: '92vh',
                    overflow: 'hidden',
                }}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e0e0e0' }} />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-3 pb-4">
                    <div>
                        <h2 className="font-playfair text-xl italic" style={{ color: 'var(--text)' }}>
                            Compartir fotos
                        </h2>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Selecciona una o varias imágenes
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        style={{
                            background: '#f5f5f5', border: 'none', borderRadius: '50%',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)',
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', padding: '0 20px 24px' }} className="space-y-4">
                    {/* File picker or preview grid */}
                    {files.length === 0 ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '100%', aspectRatio: '16/9',
                                border: '1.5px dashed #d4d4d4', borderRadius: '14px',
                                background: '#fafafa', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                        >
                            <ImagePlus size={28} color="#aaa" strokeWidth={1.5} />
                            <span style={{ fontSize: '0.82rem', color: '#aaa' }}>Toca para elegir fotos</span>
                            <span style={{ fontSize: '0.68rem', color: '#c8c8c8' }}>Solo imágenes · Máx. 2 MB cada una</span>
                        </button>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {files.length} {files.length === 1 ? 'foto' : 'fotos'} seleccionadas
                                </span>
                                {!isUploading && !allDone && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ fontSize: '0.72rem', color: 'var(--text)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Cambiar
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                                {files.map((fp, i) => (
                                    <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', background: '#f0f0f0' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={fp.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute', inset: 0, background: statusColor[fp.status],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.2s',
                                        }}>
                                            {fp.status === 'uploading' && <Loader2 size={18} color="#fff" className="animate-spin" />}
                                            {fp.status === 'done' && <CheckCircle2 size={18} color="#fff" />}
                                            {fp.status === 'error' && <AlertCircle size={18} color="#fff" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={isUploading} />

                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Tu nombre <span style={{ opacity: 0.5 }}>(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={uploaderName}
                            onChange={(e) => setUploaderName(e.target.value)}
                            placeholder="Ej: María y Carlos"
                            maxLength={50}
                            disabled={isUploading}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: '10px',
                                border: '1px solid var(--border)', fontSize: '0.85rem',
                                color: 'var(--text)', outline: 'none', background: '#fafafa',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Progress */}
                    {isUploading && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                                <span>Subiendo {currentIndex + 1} de {files.length}…</span>
                                <span>{doneCount}/{files.length}</span>
                            </div>
                            <div style={{ height: '2px', background: '#f0f0f0', borderRadius: '1px' }}>
                                <div style={{ height: '100%', background: 'var(--text)', borderRadius: '1px', width: `${(doneCount / files.length) * 100}%`, transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                    )}

                    {/* Done */}
                    {allDone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#f5f5f5', borderRadius: '12px' }}>
                            <CheckCircle2 size={18} color="#0a0a0a" />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500 }}>
                                {doneCount} {doneCount === 1 ? 'foto compartida' : 'fotos compartidas'} ✓
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    {!allDone && (
                        <button
                            onClick={handleUpload}
                            disabled={files.length === 0 || isUploading}
                            style={{
                                width: '100%', padding: '14px',
                                background: files.length === 0 || isUploading ? '#e0e0e0' : 'var(--text)',
                                color: files.length === 0 || isUploading ? '#aaa' : '#fff',
                                borderRadius: '12px', border: 'none',
                                fontSize: '0.82rem', fontWeight: 500,
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                                cursor: files.length === 0 || isUploading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'background 0.2s',
                            }}
                        >
                            {isUploading
                                ? <><Loader2 size={15} className="animate-spin" /> Subiendo…</>
                                : files.length > 1 ? `Compartir ${files.length} fotos` : 'Compartir foto'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
