import { CalendarClock } from 'lucide-react'
import { PageHeading } from '../../components/shared/PageHeading'

export default function DeadlinesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Calendrier"
        title="Échéances"
        description="Suivez toutes vos échéances fiscales et administratives"
      />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-14 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-[2]" />
          <div className="relative size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CalendarClock className="size-7 text-primary" />
          </div>
        </div>
        <h2
          className="text-lg font-bold text-foreground mb-2"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          Aucune échéance détectée
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Les échéances extraites de vos documents apparaîtront ici automatiquement.
        </p>
      </div>
    </div>
  )
}