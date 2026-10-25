import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import api from '../../services/api'
import { PageHeading } from '../../components/shared/PageHeading'

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.webp'
const MAX_SIZE_MB = 10

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Le fichier dépasse ${MAX_SIZE_MB} MB`)
      setSelectedFile(null)
      return
    }
    setError('')
    setSuccess('')
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSuccess(`Document "${response.data.data.name}" analysé avec succès !`)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'upload")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError('')
    setSuccess('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeading
        eyebrow="Analyse IA"
        title="Analyser un document"
        description="PDF, JPEG, PNG, WEBP — 10 MB maximum"
      />

      {/* Succès */}
      {success && (
        <div role="alert" className="flex items-start gap-3 p-4 mb-6 bg-secondary border border-secondary-foreground/20 rounded-xl">
          <CheckCircle2 className="size-5 text-secondary-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-secondary-foreground">{success}</p>
            <button
              onClick={() => navigate({ to: '/documents' })}
              className="text-xs text-secondary-foreground/80 underline mt-1 hover:no-underline"
            >
              Voir mes documents →
            </button>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div role="alert" className="flex items-start gap-3 p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-xl">
          <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {/* Zone upload */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xs">

        {/* Zone de drop */}
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Cliquer pour sélectionner un fichier"
          className={[
            'border-2 border-dashed rounded-xl p-12 text-center transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isLoading
              ? 'border-border cursor-not-allowed opacity-60'
              : 'border-border cursor-pointer hover:border-primary/50 hover:bg-primary/5',
          ].join(' ')}
        >
          <div className="relative mx-auto mb-4 size-14 rounded-2xl bg-highlight/15 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-highlight/20 blur-xl" />
            <Upload className="relative size-6 text-highlight-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Cliquer pour sélectionner un fichier
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPEG, PNG, WEBP — 10 MB maximum
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          disabled={isLoading}
        />

        {/* Fichier sélectionné */}
        {selectedFile && (
          <div className="mt-4 flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              disabled={isLoading}
              aria-label="Supprimer le fichier"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Bouton analyser */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <Upload className="size-4" />
              <span>Analyser le document</span>
            </>
          )}
        </button>
      </div>

      {/* Formats */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { ext: 'PDF', desc: 'Documents officiels' },
          { ext: 'JPEG', desc: 'Photos' },
          { ext: 'PNG', desc: 'Captures' },
          { ext: 'WEBP', desc: 'Images web' },
        ].map((f) => (
          <div key={f.ext} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xs font-bold text-primary">{f.ext}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}