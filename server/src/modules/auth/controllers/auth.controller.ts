import type { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../validators/auth.validators'

export class AuthController {

  async register(req: Request, res: Response): Promise<void> {
    try {
      // Valider les données entrantes
      const validatedData = registerSchema.parse(req.body)

      const result = await authService.register(validatedData)

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        data: result,
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.errors,
        })
        return
      }
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création du compte',
      })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body)

      const result = await authService.login(validatedData)

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result,
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.errors,
        })
        return
      }
      res.status(401).json({
        success: false,
        message: error.message || 'Erreur de connexion',
      })
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Avec JWT stateless, la déconnexion est gérée côté client
    // Le client supprime simplement le token de son stockage
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    })
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId
      const user = await authService.getMe(userId)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Utilisateur introuvable',
      })
    }
  }
}

export const authController = new AuthController()