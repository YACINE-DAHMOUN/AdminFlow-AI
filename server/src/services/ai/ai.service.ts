import { prisma } from '../../core/config/prisma'
import axios from 'axios'

const OLLAMA_URL = 'http://127.0.0.1:11434'
const MODEL = 'llama3'

export const aiService = {

  async analyzeDocument(
    documentId: string,
    extractedText: string
  ) {
    const prompt = buildPrompt(extractedText)
    let rawResponse = ''

    try {
      // Appel à Ollama via axios
      const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 2048,
        }
      })

      rawResponse = response.data.response
      console.log('RAW RESPONSE LLAMA3 =>', rawResponse)
      console.log('RAW LENGTH =>', rawResponse.length)
      // Parser la réponse JSON de Llama 3
      const analysis = parseAnalysis(rawResponse)

      // Sauvegarder dans la DB
      await prisma.document.update({
        where: { id: documentId },
        data: {
          extractedData: analysis,
          summary: analysis.summary,
          type: mapDocumentType(analysis.documentType),
          urgency: mapUrgency(analysis.urgency),
          status: 'DONE',
        },
      })

      // Logger dans ai_logs
      await prisma.aiLog.create({
        data: {
          documentId,
          prompt,
          response: rawResponse,
          model: MODEL,
          success: true,
        },
      })

      return analysis

    } catch (error: any) {
      await prisma.aiLog.create({
        data: {
          documentId,
          prompt,
          response: rawResponse,
          model: MODEL,
          success: false,
          error: error.message,
        },
      }).catch(() => {})

      throw new Error(`Erreur analyse IA : ${error.message}`)
    }
  },
}

// ─── PROMPT ───────────────────────────────────────────

function buildPrompt(text: string): string {
  return `Tu es un assistant expert en documents administratifs français.
Tu aides les auto-entrepreneurs, TPE et PME à comprendre leurs documents officiels.

Voici le texte extrait d'un document administratif français :
---
${text.substring(0, 3000)}
---

Analyse ce document et réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après.
Le JSON doit avoir exactement cette structure :

{
  "documentType": "URSSAF | IMPOTS | BANQUE | CONTRAT | FACTURE | COURRIER | OTHER",
  "summary": "Explication claire en 2-3 phrases simples ce que contient ce document et ce que l'utilisateur doit savoir",
  "keyInformation": [
    "Information importante 1 extraite du document",
    "Information importante 2 extraite du document"
  ],
  "amounts": [
    {
      "label": "Description du montant",
      "amount": "Montant exact avec devise",
      "type": "A_PAYER | A_RECEVOIR | INFORMATION"
    }
  ],
  "dates": [
    {
      "label": "Description de la date",
      "date": "JJ/MM/AAAA ou null si non trouvée",
      "type": "DEBUT | FIN | DEADLINE | INFORMATION"
    }
  ],
  "actions": [
    "Action concrète que l'utilisateur doit faire"
  ],
  "urgency": "LOW | MEDIUM | HIGH",
  "urgencyReason": "Explication courte pourquoi ce niveau d'urgence"
}

Règles importantes :
- Réponds UNIQUEMENT en français
- Sois clair et simple — l'utilisateur n'est pas expert comptable
- Si une information n'est pas trouvée, mets null ou un tableau vide
- Pour urgency : HIGH si deadline dans moins de 7 jours ou montant important impayé, MEDIUM si deadline dans 30 jours, LOW sinon
- Réponds UNIQUEMENT avec le JSON, aucun texte autour`
}

// ─── PARSER ───────────────────────────────────────────

function parseAnalysis(rawResponse: string): any {
  try {
    // Nettoyer la réponse
    let jsonStr = rawResponse.trim()

    // Extraire le JSON entre { et }
    const startIndex = jsonStr.indexOf('{')
    if (startIndex === -1) throw new Error('Pas de JSON trouvé')

    jsonStr = jsonStr.substring(startIndex)

    // Si le JSON est tronqué — fermer les structures ouvertes
    jsonStr = repairJson(jsonStr)

    const parsed = JSON.parse(jsonStr)
    return parsed

  } catch (error: any) {
    console.log('PARSE ERROR =>', error.message)
    return {
      documentType: 'OTHER',
      summary: 'Document analysé mais la structure n\'a pas pu être déterminée automatiquement.',
      keyInformation: [],
      amounts: [],
      dates: [],
      actions: ['Consulter le document manuellement pour vérifier les informations'],
      urgency: 'LOW',
      urgencyReason: 'Analyse automatique incomplète',
    }
  }
}

function repairJson(jsonStr: string): string {
  // Compter les accolades et crochets ouverts
  let openBraces = 0
  let openBrackets = 0
  let inString = false
  let escaped = false

  for (const char of jsonStr) {
    if (escaped) { escaped = false; continue }
    if (char === '\\') { escaped = true; continue }
    if (char === '"') { inString = !inString; continue }
    if (inString) continue

    if (char === '{') openBraces++
    if (char === '}') openBraces--
    if (char === '[') openBrackets++
    if (char === ']') openBrackets--
  }

  // Fermer les structures incomplètes
  // Si on est au milieu d'une valeur string — la fermer
  const lastQuote = jsonStr.lastIndexOf('"')
  const lastColon = jsonStr.lastIndexOf(':')
  const lastComma = jsonStr.lastIndexOf(',')

  // Supprimer la dernière virgule ou propriété incomplète
  let repaired = jsonStr.trimEnd()

  // Si la dernière ligne est incomplète (pas de valeur après :)
  if (repaired.endsWith(',')) {
    repaired = repaired.slice(0, -1)
  }

  // Fermer les crochets ouverts
  for (let i = 0; i < openBrackets; i++) {
    repaired += ']'
  }

  // Fermer les accolades ouvertes
  for (let i = 0; i < openBraces; i++) {
    repaired += '}'
  }

  return repaired
}
function mapDocumentType(type: string): any {
  const map: Record<string, string> = {
    'URSSAF': 'URSSAF',
    'IMPOTS': 'IMPOTS',
    'BANQUE': 'BANQUE',
    'CONTRAT': 'CONTRAT',
    'FACTURE': 'FACTURE',
    'COURRIER': 'COURRIER',
    'OTHER': 'OTHER',
  }
  return map[type] || 'OTHER'
}

function mapUrgency(urgency: string): any {
  const map: Record<string, string> = {
    'LOW': 'LOW',
    'MEDIUM': 'MEDIUM',
    'HIGH': 'HIGH',
  }
  return map[urgency] || 'LOW'
}