import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '../../store/auth.context'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError('')
      await login(data)
      navigate({ to: '/dashboard' })
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || 'Une erreur est survenue'
      )
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center">

      {/* Skip link accessibilité */}
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
            Connexion
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accédez à votre espace AdminFlow AI
          </p>
        </div>

        {/* Carte formulaire */}
        <main
          id="main-content"
          className="bg-card rounded-xl border border-border-border shadow-sm p-8"
        >

          {/* Erreur serveur */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 p-4 mb-6 bg-destructive/10 border-border-destructive/20 rounded-lg"
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
            aria-label="Formulaire de connexion"
          >

            {/* Champ Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Adresse email
                <span aria-hidden="true" className="text-destructive ml-1">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@example.fr"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
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
                  id="email-error"
                  role="alert"
                  className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Mot de passe
                  <span aria-hidden="true" className="text-destructive ml-1">*</span>
                </label>
                {/* TODO : réactiver quand la route /forgot-password existera (envoi d'email via Resend)
                    <Link
                      to="/forgot-password"
                      ...
                    >
                      Mot de passe oublié ?
                    </Link>
                    */}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 text-sm font-semibold text-primary-foreground
                	bg-primary hover:opacity-90
                rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed min-h-11  
                
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Connexion en cours...</span>
                  <span className="sr-only">Veuillez patienter</span>
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </main>

        {/* Lien inscription */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="	text-primary font-medium  hover:underline"
          >
            Créer un compte
          </Link>
        </p>

        {/* Mention légale */}
        <p className="text-center mt-4 text-xs text-muted-foreground">
          En vous connectant, vous acceptez nos{' '}
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