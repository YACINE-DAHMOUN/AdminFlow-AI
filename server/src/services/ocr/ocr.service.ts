import Tesseract from 'tesseract.js'

export const ocrService = {

  async extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      // Tesseract supporte : image/jpeg, image/png, image/webp, application/pdf
      const result = await Tesseract.recognize(
        fileBuffer,
        'fra+eng', // Français + Anglais — documents administratifs FR
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR progression : ${Math.round(m.progress * 100)}%`)
            }
          },
        }
      )

      const text = result.data.text.trim()

      if (!text || text.length < 10) {
        throw new Error('Impossible d\'extraire le texte de ce document')
      }

      return this.cleanText(text)
    } catch (error: any) {
      throw new Error(`Erreur OCR : ${error.message}`)
    }
  },

  // Nettoyer le texte extrait
  cleanText(text: string): string {
    return text
      .replace(/\f/g, '\n')          // Form feed → nouvelle ligne
      .replace(/\r\n/g, '\n')        // Windows line endings
      .replace(/\n{3,}/g, '\n\n')    // Max 2 lignes vides consécutives
      .replace(/[ \t]+/g, ' ')       // Espaces multiples → un seul
      .trim()
  },
}