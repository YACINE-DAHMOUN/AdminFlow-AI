import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../core/config/prisma'
import { config } from '../../../core/config'
import type { RegisterInput, LoginInput } from '../validators/auth.validators'
import type { JwtPayload, AuthResponse } from '../../../types/auth.types'

export class AuthService {

  async register(data: RegisterInput): Promise<AuthResponse> {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà')
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
    const token = this.generateToken({
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
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Générer le token JWT
    const token = this.generateToken({
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
      throw new Error('Utilisateur introuvable')
    }

    return user
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions)
  }
}

export const authService = new AuthService()