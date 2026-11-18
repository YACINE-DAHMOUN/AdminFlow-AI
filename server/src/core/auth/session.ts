import type { CookieOptions, Response } from 'express'
import { config } from '../config'
import { JwtPayload } from '../../types/auth.types'
import jwt from 'jsonwebtoken'
export const SESSION_COOKIE = 'adminflow_token'

// Options communes : les mêmes pour poser et pour effacer le cookie
const baseOptions: CookieOptions = {
  httpOnly: true,                              // inaccessible au JavaScript du navigateur
  secure: config.nodeEnv === 'production',     // HTTPS uniquement en production
  sameSite: 'lax',                             // protection CSRF
  path: '/',
}

// Pose le cookie : il expire au bout de 15 minutes, comme le jeton
export const setSessionCookie = (res: Response, token: string) => {
  res.cookie(SESSION_COOKIE, token, { ...baseOptions, maxAge: config.session.maxMs })
}

// Efface le cookie (déconnexion, session expirée)
export const clearSessionCookie = (res: Response) => {
  res.clearCookie(SESSION_COOKIE, baseOptions)
}

export const createSessionToken = (payload : JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.session.idleMs / 1000,
  }as jwt.SignOptions)
}
