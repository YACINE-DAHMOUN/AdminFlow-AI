import { prisma } from '../../../core/config/prisma'
import { storageService } from '../../../services/storage/storage.service'
import { ocrService } from '../../../services/ocr/ocr.service'
import type { CreateDocumentDto } from '../../../types/document.types'

export const documentService = {

  async uploadAndProcess(
    file: Express.Multer.File,
    userId: string
  ) {
    let fileUrl = ''
    let documentId = ''

    try {
      // Étape 1 — Upload vers Supabase Storage
      console.log('📤 Upload vers Supabase Storage...')
      fileUrl = await storageService.uploadFile(file, userId)

      // Étape 2 — Créer le document en DB avec statut PENDING
      console.log('💾 Création du document en base...')
      const document = await prisma.document.create({
        data: {
          userId,
          name: file.originalname,
          fileUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          status: 'PENDING',
        },
      })
      documentId = document.id

      // Étape 3 — OCR : extraire le texte
      console.log('🔍 Extraction OCR en cours...')
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'PROCESSING' },
      })

      const extractedText = await ocrService.extractText(
        file.buffer,
        file.mimetype
      )

      // Étape 4 — Mettre à jour avec le texte extrait
      const updatedDocument = await prisma.document.update({
        where: { id: documentId },
        data: {
          extractedText,
          status: 'DONE',
        },
      })

      console.log('✅ Document traité avec succès')
      return updatedDocument

    } catch (error: any) {
      // En cas d'erreur — mettre à jour le statut ERROR
      if (documentId) {
        await prisma.document.update({
          where: { id: documentId },
          data: { status: 'ERROR' },
        }).catch(() => {}) // Ignorer si la mise à jour échoue aussi
      }

      // Si l'upload a réussi mais l'OCR a planté — supprimer le fichier
      if (fileUrl && !documentId) {
        await storageService.deleteFile(fileUrl).catch(() => {})
      }

      throw new Error(error.message || 'Erreur lors du traitement du document')
    }
  },

  async getUserDocuments(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        fileUrl: true,
        fileSize: true,
        mimeType: true,
        summary: true,
        status: true,
        urgency: true,
        createdAt: true,
      },
    })
  },

  async getDocumentById(id: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: { id, userId },
    })

    if (!document) {
      throw new Error('Document introuvable')
    }

    return document
  },

  async deleteDocument(id: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: { id, userId },
    })

    if (!document) {
      throw new Error('Document introuvable')
    }

    // Supprimer le fichier du Storage
    await storageService.deleteFile(document.fileUrl)

    // Supprimer le document de la DB
    await prisma.document.delete({ where: { id } })
  },
}