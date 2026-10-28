import { createClient } from '@supabase/supabase-js'
import { config } from '../../core/config'

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
)

const BUCKET_NAME = 'documents'

export const storageService = {

  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<string> {
    // Créer un nom de fichier unique
    const timestamp = Date.now()
    const extension = file.originalname.split('.').pop()
    const fileName = `${userId}/${timestamp}.${extension}`

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (error) {
      throw new Error(`Erreur upload Storage : ${error.message}`)
    }

    // Retourner l'URL publique du fichier
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  async deleteFile(fileUrl: string): Promise<void> {
    // Extraire le chemin du fichier depuis l'URL
    const path = fileUrl.split(`${BUCKET_NAME}/`)[1]
    if (!path) return

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      throw new Error(`Erreur suppression Storage : ${error.message}`)
    }
  },
}