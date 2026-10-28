import { useEffect, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { PageHeading } from '../../components/shared/PageHeading'
import { EmptyState } from '../../components/shared/EmptyState'
import { documentService } from '../../services/document.service'
import type {  DocumentSummary, DocumentType } from '../../types/document.types'
import { AnalysisBadge } from '../../components/shared/AnalysisBadge'

// ═══════════ Configuration (hors du composant : créée une seule fois) ═══════════

// Libellés lisibles pour les types de document
const TYPE_LABELS: Record<DocumentType, string> = {
  URSSAF: 'URSSAF',
  IMPOTS: 'Impôts',
  BANQUE: 'Banque',
  CONTRAT: 'Contrat',
  FACTURE: 'Facture',
  COURRIER: 'Courrier',
  OTHER: 'Autre',
}



const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

// 250880 → « 245 Ko » ; null → null (on n'affiche rien)
const formatFileSize = (bytes: number | null): string | null => {
  if (bytes === null) return null
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// ═══════════ Composant ═══════════

export default function DocumentsPage() {
  // ─── 1. États ───
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // ─── 2. Chargement, une seule fois au montage ([] à la fin) ───
  useEffect(() => {
    const load = async () => {
      try {
        const data = await documentService.getAll()
        setDocuments(data)
      } catch {
        setError('Impossible de charger vos documents. Vérifiez que le serveur est lancé.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ─── 3. Affichage selon l'état ───
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Bibliothèque"
        title="Mes documents"
        description="Retrouvez tous vos documents administratifs analysés"
      />

      {isLoading ? (
        // 1. Chargement
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Chargement de vos documents…
        </div>
      ) : error ? (
        // 2. Erreur
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
        >
          <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        // 3. Vide
        <EmptyState
          title="Aucun document pour l'instant"
          description="Vos documents analysés apparaîtront ici. Commencez par uploader un document."
          ctaLabel="Uploader un document"
          ctaTo="/upload"
        />
      ) : (
        // 4. Liste
        <ul className="space-y-3">
          {documents.map((doc) => {
            const size = formatFileSize(doc.fileSize)

            return (
              <li key={doc.id} className="rounded-xl border border-border bg-card p-4">
                {/* Ligne 1 : nom du fichier + badge d'analyse */}
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-semibold text-foreground">{doc.name}</p>
                  <AnalysisBadge status={doc.status} />
                </div>

                {/* Ligne 2 : type · date · taille (la taille seulement si elle existe) */}
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {TYPE_LABELS[doc.type]} · {formatDate(doc.createdAt)}
                  {size && ` · ${size}`}
                </p>

                {/* Ligne 3 : le résumé de l'IA, ou un message selon l'état de l'analyse */}
                {doc.status === 'DONE' && doc.summary ? (
                  <p className="mt-2 text-sm text-foreground">{doc.summary}</p>
                ) : doc.status === 'ERROR' ? (
                  <p className="mt-2 text-sm text-destructive">L'analyse n'a pas pu aboutir.</p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Analyse en cours… Le résumé apparaîtra ici.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}