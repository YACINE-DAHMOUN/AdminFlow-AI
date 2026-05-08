import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import api from '../../services/api'

// Types de fichiers acceptés
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

    // Vérification taille côté client
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

    // Créer FormData à chaque upload — jamais en dehors
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

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Erreur lors de l\'upload'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError('')
    setSuccess('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            aria-label="Retour au tableau de bord"
            className="p-2 text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-1"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#0F172A]">
              Analyser un document
            </h1>
            <p className="text-xs text-[#94A3B8]">
              PDF, JPEG, PNG, WEBP — 10 MB maximum
            </p>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-6 py-8">

        {/* Message succès */}
        {success && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 p-4 mb-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg"
          >
            <CheckCircle2
              className="w-5 h-5 text-[#16A34A] mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-[#16A34A]">{success}</p>
              <button
                onClick={() => navigate({ to: '/documents' })}
                className="text-xs text-[#16A34A] underline mt-1 hover:no-underline"
              >
                Voir mes documents →
              </button>
            </div>
          </div>
        )}

        {/* Message erreur */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 p-4 mb-6 bg-[#FEF2F2] border border-[#FECACA] rounded-lg"
          >
            <AlertCircle
              className="w-5 h-5 text-[#DC2626] mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-[#DC2626]">{error}</p>
          </div>
        )}

        {/* Zone upload */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-8">

          {/* Zone de sélection */}
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Cliquer pour sélectionner un fichier"
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2
              ${isLoading
                ? 'border-[#E2E8F0] cursor-not-allowed'
                : 'border-[#CBD5E1] hover:border-[#1D4ED8] hover:bg-[#EFF6FF]'
              }
            `}
          >
            <div
              className="w-14 h-14 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Upload className="w-7 h-7 text-[#1D4ED8]" />
            </div>
            <p className="text-sm font-medium text-[#0F172A] mb-1">
              Cliquer pour sélectionner un fichier
            </p>
            <p className="text-xs text-[#94A3B8]">
              PDF, JPEG, PNG, WEBP — 10 MB maximum
            </p>
          </div>

          {/* Input caché */}
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
            <div className="mt-4 flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <FileText className="w-5 h-5 text-[#1D4ED8]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                disabled={isLoading}
                aria-label="Supprimer le fichier sélectionné"
                className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Bouton upload */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            aria-disabled={!selectedFile || isLoading}
            className="
              w-full mt-6 flex items-center justify-center gap-2
              px-4 py-2.5 text-sm font-semibold text-white
              bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A]
              rounded-lg transition-colors min-h-11
              focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Analyse en cours...</span>
                <span className="sr-only">Veuillez patienter</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Analyser le document</span>
              </>
            )}
          </button>
        </div>

        {/* Formats acceptés */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { ext: 'PDF', desc: 'Documents officiels' },
            { ext: 'JPEG', desc: 'Photos de documents' },
            { ext: 'PNG', desc: 'Captures d\'écran' },
            { ext: 'WEBP', desc: 'Images web' },
          ].map((format) => (
            <div
              key={format.ext}
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 text-center"
            >
              <p className="text-xs font-semibold text-[#1D4ED8]">
                {format.ext}
              </p>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {format.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}