import type { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../validators/auth.validators'

// Durée du cookie — 7 jours en millisecondes
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

// Options du cookie sécurisé
const cookieOptions = {
  httpOnly: true,        // Inaccessible par JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
  sameSite: 'lax' as const,  // Protection CSRF
  maxAge: COOKIE_MAX_AGE,
  path: '/',
}

export class AuthController {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body)
      const result = await authService.register(validatedData)

      // Envoyer le token en cookie httpOnly
      res.cookie('adminflow_token', result.token, cookieOptions)

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        data: {
          user: result.user
          // On ne renvoie PLUS le token dans le body
        },
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.issues,
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

      // Envoyer le token en cookie httpOnly
      res.cookie('adminflow_token', result.token, cookieOptions)

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: result.user
          // On ne renvoie PLUS le token dans le body
        },
      })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.issues,
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
    // Supprimer le cookie en lui donnant une date d'expiration passée
    res.clearCookie('adminflow_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    })

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