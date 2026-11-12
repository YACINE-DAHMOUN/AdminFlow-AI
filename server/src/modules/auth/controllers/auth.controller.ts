import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../validators/auth.validators'
import { setSessionCookie, clearSessionCookie } from '../../../core/auth/session'


export class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body)
      const result = await authService.register(validatedData)

      // Envoyer le token en cookie httpOnly
      setSessionCookie(res, result.token)
      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        data: {
          user: result.user
          // On ne renvoie PLUS le token dans le body
        },
      })
    } catch (error: any) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body)
      const result = await authService.login(validatedData)

      // Envoyer le token en cookie httpOnly
      setSessionCookie(res, result.token)
      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: result.user
          // On ne renvoie PLUS le token dans le body
        },
      })
    } catch (error: any) {
      next(error)
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    clearSessionCookie(res)
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    })
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId
      const user = await authService.getMe(userId)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error: any) {
     next(error)
    }
  }
}
export const authController = new AuthController()