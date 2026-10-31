import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import documentRoutes from './modules/documents/routes/document.routes'
import deadlineRoutes from './modules/deadlines/routes/deadline.routes'
import { apiLimiter } from '../src/core/middlewares/rateLimit.middleware'

// Routes
import authRoutes from './modules/auth/routes/auth.routes'

const app = express()

// Middlewares globaux
app.use(helmet())

// CORS — authorise les cookies cross-origin depuis le frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,    // OBLIGATOIRE pour les cookies
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())  // Parse les cookies de chaque requête

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', app: 'AdminFlow AI', version: '1.0.0' })
})

// Routes API
app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/deadlines', deadlineRoutes )


// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} introuvable`,
  })
})


export default app