import type { Response,NextFunction } from 'express'
import type { AuthRequest } from '../../../core/middlewares/auth.middleware'
import { documentService } from '../services/document.service'
import { AppError } from '../../../core/errors/AppError'

export const documentController = {

    async upload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('Aucun fichier fourni', 400)         // ← seul ce bloc a changé
      }

      const userId = req.user!.userId                           
      const document = await documentService.uploadAndProcess(req.file, userId)

      res.status(201).json({
        success: true,
        message: 'Document uploadé et analysé avec succès',
        data: document,
      })
    } catch (error) {
      next(error)
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const documents = await documentService.getUserDocuments(userId)

      res.status(200).json({
        success: true,
        data: documents,
      })
    } catch (error: any) {
     next(error)
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const { id } = req.params
      const document = await documentService.getDocumentById(id, userId)

      res.status(200).json({
        success: true,
        data: document,
      })
    } catch (error: any) {
     next(error)
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const { id } = req.params
      await documentService.deleteDocument(id, userId)

      res.status(200).json({
        success: true,
        message: 'Document supprimé avec succès',
      })
    } catch (error: any) {
     next(error)
    }
  },
}