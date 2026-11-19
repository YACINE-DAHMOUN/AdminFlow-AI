import { Resend } from 'resend'
import { config } from '../config'
import { AppError } from '../errors/AppError'

const resend = new Resend(config.email.resendApiKey)  

interface SendEmailInput {
  to: string
  subject: string
  html: string
  text: string     
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const { error } = await resend.emails.send({
    from: config.email.from, 
    to,
    subject,
    html,
    text,
  })

  if (error) {
    console.error(`Envoi d'email échoué : ${error.name}`)
    throw new AppError('Une erreur est survenue lors de l\'envoi de l\'email.', 502)
  }
}