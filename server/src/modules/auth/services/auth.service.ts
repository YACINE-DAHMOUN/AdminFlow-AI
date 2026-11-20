import bcrypt from 'bcryptjs'
import { prisma } from '../../../core/config/prisma'
import type { RegisterInput, LoginInput } from '../validators/auth.validators'
import type { AuthResponse } from '../../../types/auth.types'
import { AppError } from '../../../core/errors/AppError'
import { createSessionToken } from '../../../core/auth/session'
import { config } from '../../../core/config'
import { sendEmail } from '../../../core/email/email.service'
import { createToken, consumeToken } from './token.service'


export class AuthService {

  async verifyEmail(token: string): Promise<void> {
    // 1. Vérifier et consommer le jeton → récupérer le userId
    const userId = await consumeToken(token, 'EMAIL_VERIFY')

    // 2. Marquer le compte comme vérifié (avec la date du jour)
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    })
  }

  async register(data: RegisterInput): Promise<void> {
    // 1. Hacher en premier : même durée, que l'adresse existe ou non
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // 2. L'adresse existe-t-elle déjà ? Est-elle vérifiée ?
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, emailVerifiedAt: true },
    })

    if (existingUser) {
      if (existingUser.emailVerifiedAt) {
        // 3a. Compte vérifié : on prévient le propriétaire
        await sendEmail({
          to: data.email,
          subject: 'Tentative de création de compte Plidéa',
          text: `Quelqu'un a essayé de créer un compte Plidéa avec votre adresse. Si c'est vous, connectez-vous : ${config.appUrl}/login. Sinon, ignorez cet email.`,
          html: `<p>Quelqu'un a essayé de créer un compte Plidéa avec votre adresse.</p><p>Si c'est vous, <a href="${config.appUrl}/login">connectez-vous</a>. Sinon, ignorez cet email.</p>`,
        })
      } else {
        // 3b. Compte jamais vérifié : on renvoie un nouveau lien
        await this.sendVerificationEmail(existingUser.id, data.email)
      }
      return
    }

    // 4. Nouvelle adresse : on crée le compte (non vérifié, avec son profil vide)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: { create: {} },
      },
      select: { id: true },
    })

    // 5. Lien de confirmation
    await this.sendVerificationEmail(user.id, data.email)
  }
  // Crée un nouveau lien de confirmation et l'envoie (remplace l'ancien lien)
  private async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const token = await createToken(userId, 'EMAIL_VERIFY')
    const link = `${config.appUrl}/verify-email?token=${token}`

    await sendEmail({
      to: email,
      subject: 'Confirmez votre adresse email — Plidéa',
      text: `Bienvenue sur Plidéa ! Confirmez votre adresse en ouvrant ce lien (valable 30 minutes) : ${link}`,
      html: `<p>Bienvenue sur Plidéa !</p><p><a href="${link}">Confirmer mon adresse email</a> (lien valable 30 minutes).</p>`,
    })
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
    if (!user.emailVerifiedAt) {
      throw new AppError('Veuillez vérifier votre adresse email avant de vous connecter.', 403, 'EMAIL_NOT_VERIFIED')
    }

    // Générer le token JWT
    const token = createSessionToken({
      sessionStart: Date.now(),
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
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

  async logoutAll(userId: string): Promise<void> {
    // Incrémente le tokenVersion pour invalider tous les tokens existants
    await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    })
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
