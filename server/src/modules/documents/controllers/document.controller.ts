import type { Response } from 'express'
import type { AuthRequest } from '../../../core/middlewares/auth.middleware'
import { documentService } from '../services/document.service'

export const documentController = {

  async upload(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        })
        return
      }

      const userId = req.user!.userId
      const document = await documentService.uploadAndProcess(req.file, userId)

      res.status(201).json({
        success: true,
        message: 'Document uploadé et analysé avec succès',
        data: document,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'upload',
      })
    }
  },

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const documents = await documentService.getUserDocuments(userId)

      res.status(200).json({
        success: true,
        data: documents,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération',
      })
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const { id } = req.params
      const document = await documentService.getDocumentById(id, userId)

      res.status(200).json({
        success: true,
        data: document,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Document introuvable',
      })
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId
      const { id } = req.params
      await documentService.deleteDocument(id, userId)

      res.status(200).json({
        success: true,
        message: 'Document supprimé avec succès',
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression',
      })
    }
  },
}