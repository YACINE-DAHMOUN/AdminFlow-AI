// Une erreur "prévue" : son message peut être montré à l'utilisateur.
// Équivalent d'une HttpException en Symfony.
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,   // code HTTP à renvoyer (400 par défaut)
    public code?: string,                  // code d'erreur interne
  ) {
    super(message)                     // appelle le constructeur de Error, comme parent::__construct()
    this.name = 'AppError'
  }
  
}