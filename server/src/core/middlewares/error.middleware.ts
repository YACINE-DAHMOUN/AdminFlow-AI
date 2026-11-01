import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import multer from 'multer'
import { AppError } from '../errors/AppError'

// Un middleware d'erreurs Express a 4 paramètres : (err, req, res, next).
// C'est ce 4ᵉ paramètre qui dit à Express « je gère les erreurs ».
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // 1. Erreur prévue → on renvoie son message et son code
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message })
    return
  }

  // 2. Données invalides (Zod) → on dit QUEL champ pose problème, jamais sa valeur
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  // 3. Fichier refusé par Multer (trop gros…)
  if (err instanceof multer.MulterError) {
    const tooLarge = err.code === 'LIMIT_FILE_SIZE'
    res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge ? 'Fichier trop volumineux (10 Mo maximum)' : 'Fichier refusé',
    })
    return
  }

  // 4. Tout le reste = imprévu.
  //    Log côté serveur : la route et le TYPE d'erreur, jamais le message ni l'objet entier
  console.error(`❌ ${req.method} ${req.path} → ${err?.name ?? 'Error'}${err?.code ? ` (${err.code})` : ''}`)
  //    Réponse au navigateur : un message générique
  res.status(500).json({ success: false, message: 'Une erreur interne est survenue. Réessayez plus tard.' })
}