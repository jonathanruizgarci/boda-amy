'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Photo } from '@/types/database'

export function usePhotos() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPhotos = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPhotos(data ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar fotos')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPhotos()

        // Realtime subscription
        const channel = supabase
            .channel('photos-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'photos' },
                (payload) => {
                    setPhotos((prev) => [payload.new as Photo, ...prev])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchPhotos])

    return { photos, loading, error, refetch: fetchPhotos }
}
