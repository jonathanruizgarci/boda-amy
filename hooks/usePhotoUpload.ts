'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase, BUCKET_NAME } from '@/lib/supabase'

const MAX_FILE_SIZE_MB = 2
const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.3,       // ~300 KB target
    maxWidthOrHeight: 1920,
    useWebWorker: true,
}

export type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'success' | 'error'

export function usePhotoUpload() {
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File, uploaderName?: string): Promise<boolean> => {
        setError(null)
        setProgress(0)

        // Validate file is an image
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten imágenes.')
            setStatus('error')
            return false
        }

        // Validate file size before compression
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > MAX_FILE_SIZE_MB * 3) {
            setError(`La imagen es demasiado grande. Máximo permitido: ${MAX_FILE_SIZE_MB * 3} MB.`)
            setStatus('error')
            return false
        }

        try {
            // Step 1: Compress
            setStatus('compressing')
            setProgress(20)

            let compressedFile: File
            try {
                compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
                setProgress(60)
            } catch {
                // If compression fails, use original but enforce size limit
                compressedFile = file
                setProgress(60)
            }

            // Final size check after compression
            const finalSizeMB = compressedFile.size / (1024 * 1024)
            if (finalSizeMB > MAX_FILE_SIZE_MB) {
                setError(`La imagen comprimida supera ${MAX_FILE_SIZE_MB} MB. Por favor usa una foto más pequeña.`)
                setStatus('error')
                return false
            }

            // Step 2: Upload to Storage
            setStatus('uploading')
            setProgress(65)

            const ext = file.name.split('.').pop() ?? 'jpg'
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, compressedFile, { contentType: compressedFile.type })

            if (uploadError) throw uploadError

            setProgress(80)

            // Step 3: Get public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName)

            // Step 4: Insert row in photos table
            const { error: insertError } = await supabase.from('photos').insert({
                image_url: urlData.publicUrl,
                uploader_name: uploaderName?.trim() || null,
            })

            if (insertError) throw insertError

            setProgress(100)
            setStatus('success')
            return true
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido al subir la foto.'
            setError(message)
            setStatus('error')
            return false
        }
    }

    const reset = () => {
        setStatus('idle')
        setProgress(0)
        setError(null)
    }

    return { upload, status, progress, error, reset }
}
