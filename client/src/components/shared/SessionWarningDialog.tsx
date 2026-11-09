import { useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

interface SessionWarningDialogProps {
  open: boolean
  remainingMs: number
  onStay: () => void      // « Rester connecté »
  onLogout: () => void    // « Se déconnecter »
}

// Transforme des millisecondes en texte lisible : 112000 → « 1 min 52 s »
function formatRemaining(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes === 0) return `${seconds} s`
    if (seconds === 0) return `${minutes} min`
    return `${minutes} min ${seconds} s`
}

export function SessionWarningDialog({ open, remainingMs, onStay, onLogout }: SessionWarningDialogProps) {
  // useRef : une « poignée » vers l'élément <dialog> réel du navigateur
  const dialogRef = useRef<HTMLDialogElement>(null)

  // On ouvre ou on ferme le <dialog> quand « open » change
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()   // modal : page derrière inerte, focus piégé
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
      // Échap : on considère que l'utilisateur est là, donc il reste connecté
      onCancel={(event) => {
        event.preventDefault()   // empêche le navigateur de fermer tout seul
        onStay()
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-card p-6 text-foreground shadow-lg backdrop:bg-foreground/40"
    >
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 id="session-warning-title" className="font-heading text-lg font-semibold">
            Vous êtes toujours là ?
          </h2>
          <p id="session-warning-desc" className="mt-2 text-sm text-muted-foreground">
            Pour votre sécurité, vous allez être déconnecté dans{' '}
            <span className="font-semibold text-foreground tabular-nums">{formatRemaining(remainingMs)}</span>.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onLogout}
          className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Se déconnecter
        </button>
        <button
          type="button"
          onClick={onStay}
          autoFocus
          className="min-h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Rester connecté
        </button>
      </div>
    </dialog>
  )
}