import { z } from 'zod'

export const registerSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase(),
  password: z
    .string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .max(100, 'Le mot de passe est trop long')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule requise')
    .regex(/[a-z]/, 'Au moins une lettre minuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis'),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
})
export const emailVerificationSchema = z.object({
  token: z.string()
  .length(43, 'Ce lien n\'est plus valide. Demandez-en un nouveau.')
  .regex(/^[A-Za-z0-9_-]+$/, 'Ce lien n\'est plus valide. Demandez-en un nouveau.'),
    
})
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>