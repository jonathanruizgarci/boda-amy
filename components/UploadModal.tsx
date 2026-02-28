'use client'

import { useRef, useState, useEffect } from 'react'
import { X, ImagePlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { usePhotoUpload } from '@/hooks/usePhotoUpload'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploaderName, setUploaderName] = useState('')
    const { upload, status, progress, error, reset } = usePhotoUpload()

    // Auto-close after success
    useEffect(() => {
        if (status === 'success') {
            const t = setTimeout(() => {
                handleClose()
            }, 2000)
            return () => clearTimeout(t)
        }
    }, [status])

    const handleClose = () => {
        if (status === 'compressing' || status === 'uploading') return
        reset()
        setPreview(null)
        setSelectedFile(null)
        setUploaderName('')
        onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreview(url)
        reset()
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        await upload(selectedFile, uploaderName)
    }

    const isBusy = status === 'compressing' || status === 'uploading'

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose()
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Compartir foto 💍</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Comparte un momento especial</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isBusy}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-40"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 pb-6 space-y-4">
                    {/* Preview / File Picker */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBusy}
                        className="
              w-full aspect-video rounded-2xl border-2 border-dashed border-rose-200
              flex flex-col items-center justify-center gap-2
              bg-rose-50/40 hover:bg-rose-50/70
              transition-colors duration-200 overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed
              relative
            "
                    >
                        {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={preview}
                                alt="Vista previa"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <ImagePlus className="w-8 h-8 text-rose-300" />
                                <span className="text-sm text-rose-400 font-medium">Toca para elegir foto</span>
                                <span className="text-xs text-slate-400">Solo imágenes · Máx. 2 MB</span>
                            </>
                        )}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isBusy}
                    />

                    {/* Name input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                            Tu nombre <span className="text-slate-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={uploaderName}
                            onChange={(e) => setUploaderName(e.target.value)}
                            placeholder="Ej: María y Carlos"
                            maxLength={50}
                            disabled={isBusy}
                            className="
                w-full px-4 py-2.5 rounded-xl border border-slate-200
                text-sm text-slate-700 placeholder-slate-300
                focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent
                transition-all disabled:opacity-50
              "
                        />
                    </div>

                    {/* Progress bar */}
                    {isBusy && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{status === 'compressing' ? '⚡ Optimizando imagen...' : '☁️ Subiendo foto...'}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Success state */}
                    {status === 'success' && (
                        <div className="flex items-center gap-2.5 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">¡Foto compartida con todos! 🎉</span>
                        </div>
                    )}

                    {/* Error state */}
                    {status === 'error' && error && (
                        <div className="flex items-start gap-2.5 text-red-600 bg-red-50 rounded-xl px-4 py-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Upload button */}
                    {status !== 'success' && (
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || isBusy}
                            className="
                w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                bg-gradient-to-br from-rose-500 to-pink-600
                hover:from-rose-600 hover:to-pink-700
                active:scale-[0.98]
                transition-all duration-200
                shadow-lg shadow-rose-500/30
                flex items-center justify-center gap-2
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              "
                        >
                            {isBusy ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{status === 'compressing' ? 'Optimizando...' : 'Subiendo...'}</span>
                                </>
                            ) : (
                                <span>✨ Compartir foto</span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
