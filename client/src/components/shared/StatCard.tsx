type Tone = 'primary' | 'highlight' | 'success' | 'alert' | 'neutral'

interface StatCardProps {
  value: number | string
  label: string
  sublabel?: string
  tone?: Tone
}

const tones: Record<Tone, string> = {
  primary:   'bg-primary/10 text-primary',
  highlight: 'bg-highlight/25 text-highlight-foreground',
  success:   'bg-secondary text-secondary-foreground',
  alert:     'bg-destructive/10 text-destructive',
  neutral:   'bg-muted text-muted-foreground',
}

export function StatCard({ value, label, sublabel, tone = 'neutral' }: StatCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className={`inline-flex size-11 items-center justify-center rounded-lg text-xl font-bold mb-3 ${tones[tone]}`}>
        {value}
      </div>
      <p className="font-semibold text-foreground text-sm">{label}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
    </article>
  )
}