export type Database = {
    public: {
        Tables: {
            photos: {
                Row: {
                    id: string
                    created_at: string
                    image_url: string
                    uploader_name: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    image_url: string
                    uploader_name?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    image_url?: string
                    uploader_name?: string | null
                }
            }
        }
    }
}

export type Photo = Database['public']['Tables']['photos']['Row']
