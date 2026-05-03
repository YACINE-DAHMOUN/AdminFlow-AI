import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// Routes
import authRoutes from './modules/auth/routes/auth.routes'

const app = express()

// Middlewares globaux
app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', app: 'AdminFlow AI', version: '1.0.0' })
})

// Routes API
app.use('/api/auth', authRoutes)

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} introuvable`,
  })
})

export default app