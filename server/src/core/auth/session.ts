import type { CookieOptions, Response } from 'express'
import { config } from '../config'

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
  res.cookie(SESSION_COOKIE, token, { ...baseOptions, maxAge: config.session.idleMs })
}

// Efface le cookie (déconnexion, session expirée)
export const clearSessionCookie = (res: Response) => {
  res.clearCookie(SESSION_COOKIE, baseOptions)
}