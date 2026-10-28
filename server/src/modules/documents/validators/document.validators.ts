import multer from 'multer'

// Types de fichiers autorisés
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// Taille maximale — 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Configuration Multer — stockage en mémoire
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, callback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(
        new Error(
          'Format non supporté. Fichiers acceptés : PDF, JPEG, PNG, WEBP'
        )
      )
    }
  },
})