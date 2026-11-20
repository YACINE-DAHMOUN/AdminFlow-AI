import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../validators/auth.validators'
import { setSessionCookie, clearSessionCookie } from '../../../core/auth/session'
import { emailVerificationSchema, resendVerificationSchema } from '../validators/auth.validators'


export class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = registerSchema.parse(req.body)
    await authService.register(validatedData)

    // Même réponse que l'adresse soit nouvelle ou déjà inscrite (anti-énumération)
    res.status(202).json({
      success: true,
      message: 'Si cette adresse peut être utilisée, un email vous a été envoyé.',
    })
  } catch (error) {
    next(error)
  }
}

async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = emailVerificationSchema.parse(req.body)
    await authService.verifyEmail(validatedData.token)

    res.status(200).json({
      success: true,
      message: 'Votre adresse email est confirmée. Vous pouvez vous connecter.',
    })
  } catch (error) {
    next(error)
  }
}

async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = resendVerificationSchema.parse(req.body)
    await authService.resendVerification(validatedData.email)

    res.status(202).json({
      success: true,
      message: 'Si un compte non confirmé existe pour cette adresse, un nouveau lien vous a été envoyé.',
    })
  } catch (error) {
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

  async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
const userId = req.user!.userId
      await authService.logoutAll(userId)

      clearSessionCookie(res)
      res.status(200).json({
        success: true,
        message: 'Déconnecté de tous les appareils',
      })
    } catch (error: any) {
      next(error)
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
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