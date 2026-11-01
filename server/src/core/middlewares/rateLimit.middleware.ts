import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

// Réponse commune quand la limite est atteinte (code HTTP 429)
const tooMany = (message: string) => ({ success: false, message })

// Toute l'API : protège contre l'inondation de requêtes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // fenêtre de 15 minutes, en millisecondes
  limit: 300,                 // 300 requêtes maximum par fenêtre
  standardHeaders: 'draft-8', // envoie l'en-tête RateLimit au client (bonne pratique)
  legacyHeaders: false,       // n'envoie pas les vieux en-têtes X-RateLimit-*
  message: tooMany('Trop de requêtes. Réessayez dans quelques minutes.'),
})

export const loginLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,   // fenêtre de 15 minutes, en millisecondes
    limit : 5,                 // 5 requêtes maximum par fenêtre
    standardHeaders : 'draft-8', // envoie l'en-tête RateLimit au client (bonne pratique)
    legacyHeaders : false,       // n'envoie pas les vieux en-têtes X-RateLimit-*
    message : tooMany('Trop de tentatives. veuillez réessayez dans quelques minutes.'),
    skipSuccessfulRequests: true
})

// Toute l'API : protège contre l'inondation de requêtes
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // fenêtre de 60 minutes, en millisecondes
  limit: 5,                 // 5 requêtes maximum par fenêtre
  standardHeaders: 'draft-8', // envoie l'en-tête RateLimit au client (bonne pratique)
  legacyHeaders: false,       // n'envoie pas les vieux en-têtes X-RateLimit-*
  message: tooMany('Inscription : limite la création massive de comptes.'),
})

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // fenêtre de 60 minutes, en millisecondes
  limit: 20,                  // 20 requêtes maximum par fenêtre
  
 keyGenerator: (req) => req.user?.userId ?? ipKeyGenerator(req.ip ?? ''),
  message: tooMany('Trop de tentatives. veuillez réessayez dans quelques minutes.'),
  standardHeaders: 'draft-8',
  legacyHeaders: false,       // n'envoie pas les vieux en-têtes X-RateLimit-*
})