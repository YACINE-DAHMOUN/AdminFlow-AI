import { FileText } from 'lucide-react'
import { PageHeading } from '../../components/shared/PageHeading'
import { EmptyState } from '../../components/shared/EmptyState'

export default function DocumentsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeading
        eyebrow="Bibliothèque"
        title="Mes documents"
        description="Retrouvez tous vos documents administratifs analysés"
      />
      <EmptyState
        title="Aucun document pour l'instant"
        description="Vos documents analysés apparaîtront ici. Commencez par uploader un document."
        ctaLabel="Uploader un document"
        ctaTo="/upload"
      />
    </div>
  )
}