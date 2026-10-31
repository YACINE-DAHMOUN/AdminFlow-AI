import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

// 1. Le schéma : ce que DOIT contenir le .env
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY est requis'),

  SUPABASE_URL: z.url('SUPABASE_URL doit être une URL valide'),
  DATABASE_URL: z.url('DATABASE_URL est requise'),
})

// 2. La validation
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Configuration invalide, le serveur ne démarre pas :')
  for (const issue of parsed.error.issues) {
    // On affiche le NOM de la variable et le problème, JAMAIS sa valeur
    console.error(`  - ${issue.path.join('.')} : ${issue.message}`)
  }
  process.exit(1) // arrête le serveur
}

const env = parsed.data

// 3. Le même objet config qu'avant : le reste du code ne change pas
export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: '7d',
  supabase: {
    url: env.SUPABASE_URL,
    serviceKey: env.SUPABASE_SERVICE_KEY,
  },
  database: {
    url: env.DATABASE_URL,
  },
}