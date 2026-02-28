'use client'

import { useRef, useState, useEffect } from 'react'
import { X, ImagePlus, Loader2, CheckCircle2, AlertCircle, Images } from 'lucide-react'
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
    error?: string
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<FilePreview[]>([])
    const [uploaderName, setUploaderName] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0)
    const { upload, reset } = usePhotoUpload()

    // Auto-close 2s after all done
    useEffect(() => {
        if (allDone) {
            const t = setTimeout(() => handleClose(), 2000)
            return () => clearTimeout(t)
        }
    }, [allDone])

    const handleClose = () => {
        if (isUploading) return
        // Cleanup preview URLs
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        setFiles([])
        setUploaderName('')
        setIsUploading(false)
        setAllDone(false)
        setCurrentUploadIndex(0)
        reset()
        onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (!selected.length) return
        // Clean up old previews
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
        const newFiles: FilePreview[] = selected.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'pending' as const,
        }))
        setFiles(newFiles)
        setAllDone(false)
        setCurrentUploadIndex(0)
        reset()
    }

    const handleUpload = async () => {
        if (!files.length || isUploading) return
        setIsUploading(true)

        const updated = [...files]
        let successCount = 0

        for (let i = 0; i < updated.length; i++) {
            setCurrentUploadIndex(i)
            updated[i] = { ...updated[i], status: 'uploading' }
            setFiles([...updated])

            const ok = await upload(updated[i].file, uploaderName)
            if (ok) {
                updated[i] = { ...updated[i], status: 'done' }
                successCount++
            } else {
                updated[i] = { ...updated[i], status: 'error', error: 'Error al subir' }
            }
            setFiles([...updated])
            reset()
        }

        setIsUploading(false)
        setAllDone(true)
        if (successCount > 0) {
            onUploadComplete?.()
        }
    }

    const pendingCount = files.filter(f => f.status === 'pending').length
    const doneCount = files.filter(f => f.status === 'done').length
    const errorCount = files.filter(f => f.status === 'error').length

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Compartir fotos 💍</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Puedes elegir varias a la vez</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-40"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 pb-6 space-y-4 overflow-y-auto">
                    {/* File picker */}
                    {files.length === 0 ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video rounded-2xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center gap-2 bg-rose-50/40 hover:bg-rose-50/70 transition-colors duration-200"
                        >
                            <Images className="w-10 h-10 text-rose-300" />
                            <span className="text-sm text-rose-400 font-medium">Toca para elegir fotos</span>
                            <span className="text-xs text-slate-400">Puedes seleccionar varias · Solo imágenes · Máx. 2 MB c/u</span>
                        </button>
                    ) : (
                        /* File preview grid */
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">
                                    {files.length} {files.length === 1 ? 'foto' : 'fotos'} seleccionadas
                                </span>
                                {!isUploading && !allDone && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                                    >
                                        Cambiar
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                {files.map((fp, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={fp.previewUrl} alt="" className="w-full h-full object-cover" />
                                        {/* Status overlay */}
                                        <div className={`absolute inset-0 flex items-center justify-center transition-all ${fp.status === 'pending' ? 'bg-transparent' :
                                                fp.status === 'uploading' ? 'bg-black/40' :
                                                    fp.status === 'done' ? 'bg-emerald-500/40' :
                                                        'bg-red-500/40'
                                            }`}>
                                            {fp.status === 'uploading' && (
                                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                            )}
                                            {fp.status === 'done' && (
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            )}
                                            {fp.status === 'error' && (
                                                <AlertCircle className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
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
                            disabled={isUploading}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all disabled:opacity-50"
                        />
                    </div>

                    {/* Upload progress */}
                    {isUploading && (
                        <div className="bg-rose-50 rounded-xl px-4 py-3 space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>☁️ Subiendo foto {currentUploadIndex + 1} de {files.length}...</span>
                                <span>{doneCount}/{files.length}</span>
                            </div>
                            <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(doneCount / files.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* All done state */}
                    {allDone && (
                        <div className="flex items-center gap-2.5 bg-emerald-50 rounded-xl px-4 py-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-emerald-700">
                                    ¡{doneCount} {doneCount === 1 ? 'foto compartida' : 'fotos compartidas'}! 🎉
                                </p>
                                {errorCount > 0 && (
                                    <p className="text-xs text-red-500 mt-0.5">{errorCount} no pudieron subirse</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action button */}
                    {!allDone && (
                        <button
                            onClick={handleUpload}
                            disabled={files.length === 0 || isUploading}
                            className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Subiendo {currentUploadIndex + 1}/{files.length}...</span>
                                </>
                            ) : (
                                <span>
                                    ✨ {files.length > 1 ? `Compartir ${files.length} fotos` : 'Compartir foto'}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
