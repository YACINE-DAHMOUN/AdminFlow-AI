import { FileSearch } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface EmptyStateProps {
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
}

export function EmptyState({
  title = 'Aucun document analysé',
  description = "Uploadez votre premier document administratif pour commencer l'analyse automatique par IA.",
  ctaLabel = 'Analyser un document',
  ctaTo = '/upload',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 md:p-14 text-center  ">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-highlight/30 blur-2xl scale-[2]" />
        <div className="relative size-16 rounded-2xl bg-highlight/15 border border-highlight/20 flex items-center justify-center">
          <FileSearch className="size-7 text-highlight-foreground "aria-hidden= "true" />
        </div>
      </div>
      <h2
        className="text-lg font-bold text-foreground mb-2"
        style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
      >
        {title}
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      <Link
        to={ctaTo}
        className="inline-flex items-center min-h-11  rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity "
      >
        {ctaLabel}
      </Link>
    </div>
  )
}