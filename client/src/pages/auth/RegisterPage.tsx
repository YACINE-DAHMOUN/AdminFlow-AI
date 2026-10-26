import { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Eye, EyeOff, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../store/auth.context'

const registerSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .regex(/[A-Z]/, 'Au moins une lettre majuscule requise')
    .regex(/[a-z]/, 'Au moins une lettre minuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis (!@#$%^&*...)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

// Indicateur de force du mot de passe
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '12 caractères minimum', valid: password.length >= 12 },
    { label: 'Une lettre majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', valid: /[a-z]/.test(password) },
    { label: 'Un chiffre', valid: /[0-9]/.test(password) },
    { label: 'Un caractère spécial (!@#$%...)', valid: /[^A-Za-z0-9]/.test(password) },
  ]

  if (!password) return null

  const validCount = checks.filter(c => c.valid).length
  const strength = validCount <= 2 ? 'Faible' : validCount <= 4 ? 'Moyen' : 'Fort'
  const strengthColor =   validCount <= 2 ? 'var(--destructive)' : validCount <= 4 ? 'var(--highlight)' : 'var(--primary)'
  const strengthWidth = `${(validCount / checks.length) * 100}%`
  const strengthTextColor =
  validCount <= 2 ? 'var(--destructive)' : validCount <= 4 ? 'var(--highlight-foreground)' : 'var(--primary)'

  return (
    <div className="mt-3" >
      {/* Barre de force */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">Force du mot de passe</span>
        <span
          className="text-highlight-foreground font-semibold"
          style={{ color: strengthTextColor }}
          aria-live="polite"
          aria-label={`Force du mot de passe : ${strength}`}
        >
          {strength}
        </span>
      </div>
      <div
        className="h-1.5 w-full bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={validCount}
        aria-valuemin={0}
        aria-valuemax={checks.length}
        aria-label="Indicateur de force du mot de passe"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: strengthWidth, backgroundColor: strengthColor }}
        />
      </div>

      {/* Critères */}
      <ul className="mt-2.5 space-y-1.5" aria-label="Critères requis pour le mot de passe">
        {checks.map((check) => (
          <li
            key={check.label}
            className={`flex items-center gap-2 text-xs transition-colors ${
              check.valid ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <CheckCircle2
              className="w-3.5 h-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{check.label}</span>
            <span className="sr-only">
              {check.valid ? '— critère validé' : '— critère non validé'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')
   const {  isAuthenticated } = useAuth()

      // Dès que l'utilisateur est connecté (après login, ou s'il arrive ici déjà connecté),
   // on l'envoie vers le tableau de bord.
   useEffect(() => {
     if (isAuthenticated) navigate({ to: '/dashboard', replace: true })
   }, [isAuthenticated, navigate])

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError('')
      await registerUser({ email: data.email, password: data.password })
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || 'Une erreur est survenue'
      )
    }
  }

  return (
    <div className="min-h-screen bg-bg-background flex flex-col justify-center py-8">

      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <div className="mx-auto w-full max-w-[440px] px-4">

        {/* Logo + Titre */}
        <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center size-12 rounded-xl bg-sidebar-primary mb-4" aria-hidden="true">
                <Sparkles className="size-6 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground font-heading">
            Créer un compte
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Commencez à simplifier votre administratif
          </p>
        </div>

        {/* Badge plan gratuit */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-secondary bg-secondary text-xs font-medium text-secondary-foreground">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Gratuit — 5 documents par mois inclus
          </span>
        </div>

        {/* Carte formulaire */}
        <main
          id="main-content"
          className="bg-card rounded-xl border border-border shadow-sm p-8"
        >

          {/* Erreur serveur */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 p-4 mb-6 bg-destructive/10 border-destructive/20 rounded-lg"
            >
              <AlertCircle
                className="w-5 h-5 text-destructive mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm text-destructive font-medium">
                {serverError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulaire de création de compte"
          >

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Adresse email professionnelle
                <span aria-hidden="true" className="text-destructive ml-1">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@entreprise.fr"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'reg-email-error' : undefined}
                className={`
                  w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors
                  bg-card text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
                  ${errors.email
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-border hover:border-muted-foreground'
                  }
                `}
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="reg-email-error"
                  role="alert"
                  className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="mb-5">
              <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1.5">
                Mot de passe
                <span aria-hidden="true" className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error password-requirements' : 'password-requirements'}                  className={`
                    w-full px-3.5 py-2.5 pr-12 text-sm rounded-lg border transition-colors
                    bg-card text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
                    ${errors.password
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute top-1/2 -translate-y-1/2 right-0 inline-flex size-11 items-center justify-center rounded-full focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.password && (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {errors.password.message}
                </p>
              )}
              <div id="password-requirements">
                <PasswordStrength password={passwordValue} />
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirmer le mot de passe
                <span aria-hidden="true" className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                  className={`
                    w-full px-3.5 py-2.5 pr-12 text-sm rounded-lg border transition-colors
                    bg-card text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
                    ${errors.confirmPassword
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                  className="absolute top-1/2 -translate-y-1/2 right-0 inline-flex size-11 items-center justify-center"
                >
                  {showConfirm
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-error"
                  role="alert"
                  className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 text-sm font-semibold text-primary-foreground
                bg-primary hover:opacity-90]
                rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
                min-h-11
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Création en cours...</span>
                  <span className="sr-only">Veuillez patienter</span>
                </>
              ) : (
                'Créer mon compte gratuitement'
              )}
            </button>
          </form>
        </main>

        {/* Lien connexion */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-primary font-medium  hover:underline"
          >
            Se connecter
          </Link>
        </p>

        {/* Mentions légales */}
        <p className="text-center mt-4 text-xs text-muted-foreground leading-relaxed">
          En créant un compte, vous acceptez nos{' '}
          <a href="/mentions-legales" className="underline hover:text-foreground">
            mentions légales
          </a>{' '}
          et notre{' '}
          <a href="/confidentialite" className="underline hover:text-foreground">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  )
}