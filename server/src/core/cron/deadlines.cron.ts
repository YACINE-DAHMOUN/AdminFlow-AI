import cron from 'node-cron'
import {prisma} from '../config/prisma'

export const startDeadlinesCron =() => {
  cron.schedule('0 2 * * *', async () => {
    console.log ('⏰ Cron deadlines — vérification des statuts...')

    const now = new Date()
    const in7Days = new Date()
    in7Days.setDate(now.getDate() + 7)

    //1. Passer en OVERDUE les deadlines doont dueDate est dépassée et qui ne sont pas DONE

    await prisma.deadline.updateMany({
      where: {
        dueDate: { lt: now },
        status: 'PENDING',
      },
      data: {
        status: 'OVERDUE',
      },
    })

    //2. Passer en URGENT les deadlines dont dueDate est dans les 7 prochains jours et qui ne sont pas pending

    await prisma.deadline.updateMany({
      where: {
        dueDate: { gte: now, lte: in7Days },    
        status: 'PENDING',
      },
      data: {
        status: 'URGENT',
      },
    })
    console.log('✅ Statuts mis à jour')
    })
}