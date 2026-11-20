import { BrandName } from '@/components/shared/BrandName'
import { LogoMark } from '@/components/shared/LogoMark'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-8">
      <div className="mx-auto w-full max-w-[440px] px-4">

        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-xl bg-sidebar-primary mb-4" aria-hidden="true">
            <LogoMark alt="" className="size-12" />
          </div>
          <BrandName className="block text-3xl font-bold text-foreground" accentClassName="text-brand-accent-ink" />
          <h1 className="text-2xl font-semibold text-foreground font-heading">
            Confirmation de votre adresse
          </h1>
        </div>

        {/* Carte */}
        <main
          id="main-content"
          className="bg-card rounded-xl border border-border shadow-sm p-8"
        >
          <p className="text-center text-sm text-muted-foreground">
            Vérification en cours…
          </p>
        </main>

      </div>
    </div>
  )
}