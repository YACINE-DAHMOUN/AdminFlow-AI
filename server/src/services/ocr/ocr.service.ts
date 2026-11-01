import Tesseract from 'tesseract.js'
import { AppError } from '../../core/errors/AppError'


export const ocrService = {

  async extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (mimeType === 'application/pdf') {
        return await this.extractTextFromPdfNative(fileBuffer)
      }
      return await this.extractTextFromImage(fileBuffer)
    } catch (error: any) {
      // Erreur prévue (AppError) : on la laisse remonter telle quelle jusqu'au filet
      if (error instanceof AppError) throw error
      // Erreur technique (pdfjs, Tesseract…) : on l'emballe, elle deviendra un 500 générique
      throw new Error(`Erreur OCR : ${error.message}`)
    }
  },

  async extractTextFromPdfNative(pdfBuffer: Buffer): Promise<string> {
    // Utilise pdfjs pour extraire le texte directement sans conversion image
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) })
    const pdf = await loadingTask.promise

    let fullText = ''

    // Extraire le texte de chaque page
    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n\n'
    }

    if (!fullText.trim() || fullText.trim().length < 10) {
      throw new AppError('Ce PDF ne contient pas de texte extractible (PDF scanné ?)', 422)
    }

    return this.cleanText(fullText)
  },

  async extractTextFromImage(fileBuffer: Buffer): Promise<string> {
    const result = await Tesseract.recognize(
      fileBuffer,
      'fra+eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR image : ${Math.round(m.progress * 100)}%`)
          }
        },
      }
    )

    const text = result.data.text.trim()
    if (!text || text.length < 10) {
      throw new AppError('Impossible d\'extraire le texte de ce document', 422)
    }

    return this.cleanText(text)
  },

  cleanText(text: string): string {
    return text
      .replace(/\f/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()
  },
}