import { config } from 'dotenv'
config()

import app from './app'
import { startDeadlinesCron, updateDeadlineStatuses } from './core/cron/deadlines.cron'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 AdminFlow AI Server running on port ${PORT}`)

  // Mise à jour immédiate au démarrage : pas besoin d'attendre 2h du matin
  updateDeadlineStatuses().catch((error) =>
    console.error('❌ Mise à jour des statuts au démarrage — erreur :', error)
  )

  // Puis chaque nuit à 2h
  startDeadlinesCron()
})