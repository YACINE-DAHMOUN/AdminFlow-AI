import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import type { JwtPayload } from '../../types/auth.types'
import { SESSION_COOKIE, createSessionToken, setSessionCookie, clearSessionCookie } from '../auth/session'

export type AuthRequest = Request   // express.d.ts ajoute déjà user à Request

// Réponse commune quand la session n'est plus valable
const sessionExpired = (res: Response) => {
  clearSessionCookie(res)
  res.status(401).json({
    success: false,
    code: 'SESSION_EXPIRED',
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
  })
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.[SESSION_COOKIE]
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentification requise' })
    return
  }

  let decoded: JwtPayload
  try {
    // Vérifie la signature ET la date d'expiration (15 min sans activité)
    decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
  } catch {
    sessionExpired(res)
    return
  }

  // Limite absolue : 8 h depuis la connexion, même si l'utilisateur est actif
  // (les anciens jetons sans sessionStart sont aussi refusés)
  if (typeof decoded.sessionStart !== 'number' || Date.now() - decoded.sessionStart > config.session.maxMs) {
    sessionExpired(res)
    return
  }

  // Renouvellement glissant : un nouveau jeton de 15 min, avec le MÊME sessionStart
  const payload: JwtPayload = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    sessionStart: decoded.sessionStart,
  }
  setSessionCookie(res, createSessionToken(payload))

  req.user = payload
  next()
}