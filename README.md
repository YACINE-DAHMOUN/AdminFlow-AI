# AdminFlow AI
> L'IA qui simplifie la bureaucratie française 🇫🇷

## Présentation

AdminFlow AI est une application SaaS qui aide les auto-entrepreneurs, TPE/PME
et particuliers français à gérer leur administratif quotidien grâce à l'IA.

### Fonctionnalités principales

- 📄 Analyse automatique de documents administratifs (OCR + IA)
- 🗓️ Détection et suivi des échéances fiscales et administratives
- 🤖 Simplification et explication des documents complexes
- 🔌 Centralisation des données multi-plateformes
- 👤 Espace admin pour la gestion des utilisateurs

## Stack technique

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 5 | Bundler |
| TypeScript | 5 | Typage statique |
| Tailwind CSS | 4 | Styles utilitaires |
| shadcn/ui | latest | Composants UI (Radix + Lucide + Geist) |
| TanStack Router | 1 | Routing typé |
| TanStack Query | 5 | Gestion état serveur |
| Zod | 3 | Validation schémas |
| React Hook Form | 7 | Gestion formulaires |

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| Node.js | 22 | Runtime |
| Express | 4 | Framework HTTP |
| TypeScript | 5 | Typage statique |
| Prisma | 5 | ORM PostgreSQL |
| Supabase | 2 | Auth + DB + Storage |
| Tesseract.js | 5 | OCR documents |
| Ollama + Llama 3 | local | Analyse IA |
| JWT + bcryptjs | - | Authentification |

## Structure du projet
AdminFlow-AI/
├── client/                        # Application React (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Composants shadcn/ui
│   │   │   ├── layout/            # Navbar, Sidebar, Layout global
│   │   │   └── shared/            # Composants réutilisables
│   │   ├── pages/
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── dashboard/         # Page principale
│   │   │   ├── documents/         # Upload, liste, détail document
│   │   │   ├── deadlines/         # Suivi des échéances
│   │   │   ├── admin/             # Dashboard administrateur
│   │   │   └── integrations/      # Connecteurs externes
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # Appels API vers le backend
│   │   ├── store/                 # État global (Zustand)
│   │   ├── types/                 # Types TypeScript partagés
│   │   └── utils/                 # Fonctions utilitaires
│   ├── public/                    # Assets statiques
│   ├── .env                       # Variables d'environnement (non commité)
│   ├── .env.example               # Template des variables d'environnement
│   ├── index.html                 # Point d'entrée HTML
│   ├── vite.config.ts             # Configuration Vite
│   ├── tsconfig.json              # Configuration TypeScript
│   └── package.json               # Dépendances frontend
│
├── server/                        # API Node.js (port 3001)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentification JWT + Supabase
│   │   │   │   ├── controllers/   # Logique des requêtes HTTP
│   │   │   │   ├── routes/        # Définition des endpoints
│   │   │   │   ├── services/      # Logique métier
│   │   │   │   └── validators/    # Validation des données (Zod)
│   │   │   ├── documents/         # Upload + pipeline IA
│   │   │   ├── deadlines/         # Détection + gestion échéances
│   │   │   ├── users/             # Profils utilisateurs et plans
│   │   │   ├── admin/             # Routes réservées aux admins
│   │   │   └── integrations/      # Connecteurs externes
│   │   ├── services/
│   │   │   ├── ai/                # Service Ollama + Llama 3
│   │   │   ├── ocr/               # Service Tesseract.js
│   │   │   └── storage/           # Service Supabase Storage
│   │   ├── core/
│   │   │   ├── middlewares/       # Auth, erreurs, rate-limiting
│   │   │   ├── utils/             # Fonctions utilitaires partagées
│   │   │   └── config/            # Variables d'environnement centralisées
│   │   ├── types/                 # Types TypeScript backend
│   │   ├── app.ts                 # Configuration Express
│   │   └── server.ts              # Point d'entrée du serveur
│   ├── prisma/
│   │   └── schema.prisma          # Schéma de la base de données
│   ├── .env                       # Variables d'environnement (non commité)
│   ├── .env.example               # Template des variables d'environnement
│   ├── nodemon.json               # Configuration hot reload
│   ├── tsconfig.json              # Configuration TypeScript
│   └── package.json               # Dépendances backend
│
├── .gitignore                     # Fichiers exclus de Git
├── package.json                   # Workspaces npm + scripts racine
└── README.md                      # Ce fichier
## Installation

### Prérequis

Installer ces outils avant de commencer :

- **Node.js >= 22** — télécharger sur [nodejs.org](https://nodejs.org)
- **npm >= 10** — inclus avec Node.js
- **Git** — télécharger sur [git-scm.com](https://git-scm.com)
- **Ollama** — télécharger sur [ollama.ai](https://ollama.ai), puis lancer `ollama pull llama3`
- **Compte Supabase gratuit** — créer sur [supabase.com](https://supabase.com)

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone https://github.com/TON_USER/AdminFlow-AI.git
cd AdminFlow-AI

# 2. Installer les dépendances frontend
cd client
npm install

# 3. Installer les dépendances backend
cd ../server
npm install
```

### Variables d'environnement

**Étape 1** — Créer le fichier `client/.env` et coller :