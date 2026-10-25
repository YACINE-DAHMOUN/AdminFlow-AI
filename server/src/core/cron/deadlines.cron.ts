import cron from 'node-cron'
import { prisma } from '../config/prisma'

/**
 * Met à jour les statuts des échéances selon leur date limite.
 * - OVERDUE : date dépassée (et pas encore traitée)
 * - URGENT  : date dans les 7 prochains jours
 *
 * Appelée par le cron chaque nuit ET au démarrage du serveur.
 */
export const updateDeadlineStatuses = async () => {
  console.log('⏰ Deadlines — vérification des statuts...')

  // Calculées À CHAQUE APPEL : sinon la date serait figée au lancement du serveur
  const now = new Date()
  const in7Days = new Date(now)
  in7Days.setDate(now.getDate() + 7)

  // 1. OVERDUE : date dépassée, statut PENDING ou URGENT
  //    (DONE et CANCELLED ne sont jamais touchés)
  const overdue = await prisma.deadline.updateMany({
    where: {
      dueDate: { lt: now },
      status: { in: ['PENDING', 'URGENT'] },
    },
    data: { status: 'OVERDUE' },
  })

  // 2. URGENT : date dans les 7 prochains jours, encore PENDING
  const urgent = await prisma.deadline.updateMany({
    where: {
      dueDate: { gte: now, lte: in7Days },
      status: 'PENDING',
    },
    data: { status: 'URGENT' },
  })

  console.log(`✅ Statuts mis à jour — ${overdue.count} en retard, ${urgent.count} urgente(s)`)
}

/**
 * Programme la mise à jour chaque nuit à 2h.
 * Ne contient AUCUNE logique métier : il ne fait qu'appeler updateDeadlineStatuses.
 */
export const startDeadlinesCron = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      await updateDeadlineStatuses()
    } catch (error) {
      console.error('❌ Cron deadlines — erreur :', error)
    }
  })
  console.log('⏰ Cron deadlines programmé (tous les jours à 2h)')
}