import crypto from 'crypto'
import type { AuthTokenType } from '@prisma/client'
import { prisma } from '../../../core/config/prisma'
import { AppError } from '../../../core/errors/AppError'

// Durée de validité selon le type (en millisecondes)
const TOKEN_TTL_MS: Record<AuthTokenType, number> = {
    EMAIL_VERIFY: 30 * 60 * 1000,      // 30 minutes
    PASSWORD_RESET: 15 * 60 * 1000,    // 15 minutes
}

function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
}

export async function createToken(userId: string, type: AuthTokenType): Promise<string> {
    const token = crypto.randomBytes(32).toString('base64url')   // 32 octets aléatoires en base64url

    const tokenHash = hashToken(token)
    await prisma.authToken.deleteMany({
        where: { userId, type, usedAt: null },
    })
    await prisma.authToken.create({
        data: {
            userId: userId,

            type: type,
            tokenHash: tokenHash,
            expiresAt: new Date(Date.now() + TOKEN_TTL_MS[type]),
        },
    })

    return token
}

export async function consumeToken(token: string, type: AuthTokenType): Promise<string> {
    const tokenHash = hashToken(token)

    // Vérifier ET consommer en UNE requête : non utilisé, non expiré, bon type
    const result = await prisma.authToken.updateMany({
        where: { tokenHash, type, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
    })

    if (result.count === 0) {
        throw new AppError('Ce lien n\'est plus valide. Demandez-en un nouveau.', 400)
    }

    const authToken = await prisma.authToken.findUnique({ where: { tokenHash } })
    return authToken!.userId

}