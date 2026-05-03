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
| Axios | 1.6 | Client HTTP |

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
| Zod | 3 | Validation données entrantes |

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
│   │   │   ├── documents/         # Upload, liste, détail
│   │   │   ├── deadlines/         # Suivi des échéances
│   │   │   ├── admin/             # Dashboard administrateur
│   │   │   └── integrations/      # Connecteurs externes
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # Appels API vers le backend
│   │   ├── store/                 # État global
│   │   ├── types/                 # Types TypeScript partagés
│   │   └── utils/                 # Fonctions utilitaires
│   ├── public/                    # Assets statiques
│   ├── .env                       # Variables d'environnement (non commité)
│   ├── .env.example               # Template variables d'environnement
│   ├── index.html                 # Point d'entrée HTML
│   ├── vite.config.ts             # Configuration Vite
│   ├── tsconfig.json              # Configuration TypeScript
│   └── package.json               # Dépendances frontend
│
├── server/                        # API Node.js (port 3001)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentification JWT ✅
│   │   │   │   ├── controllers/   # Traitement des requêtes HTTP
│   │   │   │   ├── routes/        # Endpoints : /api/auth/*
│   │   │   │   ├── services/      # Logique métier (register, login)
│   │   │   │   └── validators/    # Schémas Zod
│   │   │   ├── documents/         # Upload + pipeline IA (Phase 3)
│   │   │   ├── deadlines/         # Gestion échéances (Phase 5)
│   │   │   ├── users/             # Profils et plans
│   │   │   ├── admin/             # Dashboard admin (Phase 7)
│   │   │   └── integrations/      # Connecteurs (Phase 8)
│   │   ├── services/
│   │   │   ├── ai/                # Ollama + Llama 3 (Phase 4)
│   │   │   ├── ocr/               # Tesseract.js (Phase 3)
│   │   │   └── storage/           # Supabase Storage (Phase 3)
│   │   ├── core/
│   │   │   ├── config/
│   │   │   │   ├── index.ts       # Variables d'environnement centralisées
│   │   │   │   └── prisma.ts      # Client Prisma singleton
│   │   │   ├── middlewares/
│   │   │   │   └── auth.middleware.ts  # JWT + garde admin
│   │   │   └── utils/             # Fonctions utilitaires
│   │   └── types/
│   │       └── auth.types.ts      # Interfaces TypeScript auth
│   ├── prisma/
│   │   ├── schema.prisma          # Schéma base de données
│   │   └── migrations/            # Historique des migrations SQL
│   ├── .env                       # Variables d'environnement (non commité)
│   ├── .env.example               # Template variables d'environnement
│   ├── nodemon.json               # Configuration hot reload
│   ├── tsconfig.json              # Configuration TypeScript
│   └── package.json               # Dépendances backend
│
├── .gitignore                     # Fichiers exclus de Git
├── package.json                   # Workspaces npm + scripts racine
└── README.md                      # Ce fichier

## API Endpoints disponibles

### Authentification — `/api/auth`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | /health | Public | Vérification que le serveur tourne |
| POST | /api/auth/register | Public | Créer un compte |
| POST | /api/auth/login | Public | Se connecter — retourne un token JWT |
| POST | /api/auth/logout | Public | Se déconnecter |
| GET | /api/auth/me | 🔒 JWT requis | Récupérer l'utilisateur connecté |

## Base de données

### Tables PostgreSQL (Supabase)

| Table | Description |
|---|---|
| users | Comptes utilisateurs avec role et plan |
| profiles | Informations professionnelles (SIREN, régime fiscal) |
| documents | Documents uploadés et analysés par l'IA |
| deadlines | Échéances détectées automatiquement ou créées manuellement |
| integrations | Connecteurs vers des services externes |
| ai_logs | Journal de toutes les analyses IA |

## Installation

### Prérequis

- **Node.js >= 22** — [nodejs.org](https://nodejs.org)
- **npm >= 10** — inclus avec Node.js
- **Git** — [git-scm.com](https://git-scm.com)
- **Ollama** — [ollama.ai](https://ollama.ai) puis `ollama pull llama3`
- **Compte Supabase gratuit** — [supabase.com](https://supabase.com)

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone https://github.com/TON_USER/AdminFlow-AI.git
cd AdminFlow-AI

# 2. Installer les dépendances
cd client && npm install
cd ../server && npm install

# 3. Configurer les variables d'environnement
# Créer client/.env et server/.env (voir section ci-dessous)

# 4. Appliquer les migrations Prisma
cd server && npx prisma migrate deploy

# 5. Lancer l'application (2 terminaux)
# Terminal 1 — Frontend
cd client && npm run dev

# Terminal 2 — Backend
cd server && npm run dev
```

### Variables d'environnement

**Créer `client/.env`** :
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://TONPROJET.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...

**Créer `server/.env`** :
DATABASE_URL=postgresql://postgres.TONPROJET:MOTDEPASSE@pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.TONPROJET:MOTDEPASSE@pooler.supabase.com:5432/postgres
SUPABASE_URL=https://TONPROJET.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_KEY=sb_secret_...
JWT_SECRET=change-this-in-production
PORT=3001
NODE_ENV=development

> Les valeurs se trouvent dans Supabase → Settings → API et Settings → Database

### Vérification

- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend health check : [http://localhost:3001/health](http://localhost:3001/health)

## Monétisation

| Plan | Prix | Documents/mois | Stockage |
|---|---|---|---|
| FREE | Gratuit | 5 | 100 MB |
| PLUS | À définir | 50 | 1 GB |
| PRO | À définir | Illimité | 10 GB |

## Roadmap

- [x] Phase 1 — Architecture & Setup
- [ ] Phase 2 — Base de données & Authentification *(backend terminé)*
- [ ] Phase 3 — Upload + OCR
- [ ] Phase 4 — Pipeline IA
- [ ] Phase 5 — Échéances
- [ ] Phase 6 — UI complète
- [ ] Phase 7 — Dashboard Admin
- [ ] Phase 8 — Intégrations
- [ ] Phase 9 — Optimisation & Déploiement

## Licence

MIT
