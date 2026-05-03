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
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token manquant — authentification requise',
      })
      return
    }

    const token = authHeader.split(' ')[1]

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