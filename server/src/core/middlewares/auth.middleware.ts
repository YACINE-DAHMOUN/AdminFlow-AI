import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import type { JwtPayload } from '../../types/auth.types'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Lire le token depuis le cookie httpOnly EN PRIORITÉ
    // Fallback sur le header Authorization pour les tests API
    const tokenFromCookie = req.cookies?.adminflow_token
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]
    const token = tokenFromCookie || tokenFromHeader

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token manquant — authentification requise',
      })
      return
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    })
  }
}

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Accès refusé — droits administrateur requis',
    })
    return
  }
  next()
}