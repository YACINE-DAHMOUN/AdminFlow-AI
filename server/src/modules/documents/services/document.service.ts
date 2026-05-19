import { prisma } from '../../../core/config/prisma'
import { storageService } from '../../../services/storage/storage.service'
import { ocrService } from '../../../services/ocr/ocr.service'
import { aiService } from '../../../services/ai/ai.service'
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

      // Étape 3 — OCR
      console.log('🔍 Extraction OCR en cours...')
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'PROCESSING' },
      })

      const extractedText = await ocrService.extractText(
        file.buffer,
        file.mimetype
      )

      // Étape 4 — Mise à jour avec le texte extrait
      await prisma.document.update({
        where: { id: documentId },
        data: { extractedText },
      })

      // Étape 5 — Analyse IA
      console.log('🤖 Analyse IA en cours...')
      const analysis = await aiService.analyzeDocument(
        documentId,
        extractedText
      )
        console.log('AI ANALYSIS =>', analysis) 
      // Étape 6 — Créer les échéances détectées automatiquement
      if (analysis.dates && analysis.dates.length > 0) {
        console.log('📅 Création des échéances détectées...')
        await createDeadlinesFromAnalysis(
          userId,
          documentId,
          analysis
        )
      }

      // Étape 7 — Récupérer le document final mis à jour
      const finalDocument = await prisma.document.findUnique({
        where: { id: documentId },
      })

      console.log('✅ Document traité avec succès')
      return finalDocument

    } catch (error: any) {
      if (documentId) {
        await prisma.document.update({
          where: { id: documentId },
          data: { status: 'ERROR' },
        }).catch(() => {})
      }

      if (fileUrl && !documentId) {
        await storageService.deleteFile(fileUrl).catch(() => {})
      }

      console.error('FULL ERROR =>', error)
      throw error    }
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
    if (!document) throw new Error('Document introuvable')
    return document
  },

  async deleteDocument(id: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: { id, userId },
    })
    if (!document) throw new Error('Document introuvable')
    await storageService.deleteFile(document.fileUrl)
    await prisma.document.delete({ where: { id } })
  },
}

// ─── HELPER — Créer les échéances depuis l'analyse IA ─

async function createDeadlinesFromAnalysis(
  userId: string,
  documentId: string,
  analysis: any
) {
  const deadlineDates = analysis.dates.filter(
    (d: any) => d.type === 'DEADLINE' || d.type === 'FIN'
  )

  for (const dateInfo of deadlineDates) {
    if (!dateInfo.date || dateInfo.date === 'null') continue

    try {
      // Parser la date au format JJ/MM/AAAA
      const parts = dateInfo.date.split('/')
      if (parts.length !== 3) continue

      const dueDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      )

      if (isNaN(dueDate.getTime())) continue

      await prisma.deadline.create({
        data: {
          userId,
          documentId,
          title: dateInfo.label || 'Échéance détectée',
          dueDate,
          status: 'PENDING',
          urgency: analysis.urgency || 'LOW',
        },
      })

      console.log(`📅 Échéance créée : ${dateInfo.label} — ${dateInfo.date}`)
    } catch {
      console.log(`⚠️ Impossible de créer l'échéance : ${dateInfo.date}`)
    }
  }
}