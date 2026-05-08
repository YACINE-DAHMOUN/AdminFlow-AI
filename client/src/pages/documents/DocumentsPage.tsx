import { useNavigate } from '@tanstack/react-router'
import { FileText, Upload, ArrowLeft } from 'lucide-react'

export default function DocumentsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            aria-label="Retour au tableau de bord"
            className="p-2 text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-1"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="text-base font-semibold text-[#0F172A]">
            Mes documents
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-sm">
          <div
            className="w-14 h-14 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <FileText className="w-7 h-7 text-[#1D4ED8]" />
          </div>
          <h2 className="text-base font-semibold text-[#0F172A] mb-2">
            Mes documents
          </h2>
          <p className="text-sm text-[#475569] max-w-sm mx-auto mb-6">
            La liste complète de vos documents sera disponible en Phase 6.
            Uploadez un document pour tester le pipeline IA.
          </p>
          <button
            onClick={() => navigate({ to: '/upload' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors min-h-11 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            Analyser un document
          </button>
        </div>
      </main>
    </div>
  )
}