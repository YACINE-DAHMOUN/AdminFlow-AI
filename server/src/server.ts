import { config } from 'dotenv'
import { startDeadlinesCron } from './core/cron/deadlines.cron'

config()

import app from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 AdminFlow AI Server running on port ${PORT}`)
})

startDeadlinesCron()
console.log('⏰ Cron deadlines démarré')