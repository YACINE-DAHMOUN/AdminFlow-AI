import { z } from 'zod'

export const registerSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe est trop long'),
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

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>