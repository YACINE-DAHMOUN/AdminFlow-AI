import bcrypt from 'bcryptjs'
import { prisma } from '../../../core/config/prisma'
import type { RegisterInput, LoginInput } from '../validators/auth.validators'
import type { AuthResponse } from '../../../types/auth.types'
import { AppError } from '../../../core/errors/AppError'
import { createSessionToken } from '../../../core/auth/session'


export class AuthService {

  async register(data: RegisterInput): Promise<AuthResponse> {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new AppError('Email déjà utilisé', 409)
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: {
          create: {} // Créer un profil vide automatiquement
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        plan: true,
      }
    })

    // Générer le token JWT
    const token = createSessionToken({
     sessionStart: Date.now(),
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      token,
    }
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401)
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401)
    }

    // Générer le token JWT
    const token = createSessionToken({
      sessionStart: Date.now(),
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      token,
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        profile: {
          select: {
            companyName: true,
            siren: true,
            taxRegime: true,
            phone: true,
            address: true,
          }
        }
      }
    })

    if (!user) {
      throw new AppError('Utilisateur introuvable', 404)
    }

    return user
  }

  
}

export const authService = new AuthService()
