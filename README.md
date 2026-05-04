AdminFlow AI

L'IA qui simplifie la bureaucratie française 🇫🇷

Présentation
AdminFlow AI est une application SaaS qui aide les auto-entrepreneurs, TPE/PME et particuliers français à gérer leur administratif quotidien grâce à l'intelligence artificielle.
Fonctionnalités principales

📄 Analyse automatique de documents administratifs (OCR + IA)
🗓️ Détection et suivi des échéances fiscales et administratives
🤖 Simplification et explication des documents complexes en langage clair
🔌 Centralisation des données multi-plateformes
👤 Espace administrateur pour la gestion des utilisateurs
🔐 Authentification sécurisée par cookie httpOnly (protection XSS)


Stack technique
Frontend
TechnologieVersionRôleReact18Framework UIVite5Bundler ultra-rapideTypeScript5Typage statiqueTailwind CSS4Styles utilitairesshadcn/uilatestComposants UI (Radix + Lucide + Geist)TanStack Router1Routing 100% TypeScriptTanStack Query5Gestion état serveurZod3Validation des schémasReact Hook Form7Gestion des formulairesAxios1.6Client HTTP avec cookies
Backend
TechnologieVersionRôleNode.js22Runtime JavaScriptExpress4Framework HTTPTypeScript5Typage statiquePrisma5ORM PostgreSQLSupabase2Auth + DB + StorageTesseract.js5OCR documentsOllama + Llama 3localAnalyse IA locale et gratuiteJWT + bcryptjs-Authentification sécuriséeZod3Validation des données entrantescookie-parser1.4Lecture des cookies httpOnly

Structure du projet
AdminFlow-AI/
├── client/                             # Application React (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     # Composants shadcn/ui
│   │   │   ├── layout/                 # Navbar, Sidebar, Layout global
│   │   │   └── shared/
│   │   │       └── ProtectedRoute.tsx  # Garde de route JWT ✅
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx       # Page connexion ✅
│   │   │   │   └── RegisterPage.tsx    # Page inscription ✅
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.tsx   # Dashboard placeholder ✅
│   │   │   ├── documents/              # Phase 3
│   │   │   ├── deadlines/              # Phase 5
│   │   │   ├── admin/                  # Phase 7
│   │   │   └── integrations/           # Phase 8
│   │   ├── services/
│   │   │   ├── api.ts                  # Instance Axios + withCredentials ✅
│   │   │   └── auth.service.ts         # Service auth sans localStorage ✅
│   │   ├── store/
│   │   │   └── auth.context.tsx        # Contexte Auth + useAuth hook ✅
│   │   ├── types/
│   │   │   └── auth.types.ts           # Interfaces TypeScript auth ✅
│   │   ├── hooks/                      # Custom React hooks
│   │   └── utils/                      # Fonctions utilitaires
│   ├── public/                         # Assets statiques
│   ├── index.html                      # Point d'entrée HTML
│   ├── vite.config.ts                  # Configuration Vite + alias @/
│   ├── vite-env.d.ts                   # Types Vite pour import.meta.env
│   ├── tsconfig.json                   # Configuration TypeScript
│   ├── .env                            # Variables d'environnement (non commité)
│   ├── .env.example                    # Template variables d'environnement
│   └── package.json                    # Dépendances frontend
│
├── server/                             # API Node.js (port 3001)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/                   # Module authentification ✅
│   │   │   │   ├── controllers/
│   │   │   │   │   └── auth.controller.ts   # Cookie httpOnly ✅
│   │   │   │   ├── routes/
│   │   │   │   │   └── auth.routes.ts       # Endpoints /api/auth/* ✅
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts      # register, login, getMe ✅
│   │   │   │   └── validators/
│   │   │   │       └── auth.validators.ts   # Zod — politique 12 chars ✅
│   │   │   ├── documents/              # Phase 3
│   │   │   ├── deadlines/              # Phase 5
│   │   │   ├── users/                  # Phase 2+
│   │   │   ├── admin/                  # Phase 7
│   │   │   └── integrations/           # Phase 8
│   │   ├── services/
│   │   │   ├── ai/                     # Ollama + Llama 3 — Phase 4
│   │   │   ├── ocr/                    # Tesseract.js — Phase 3
│   │   │   └── storage/                # Supabase Storage — Phase 3
│   │   ├── core/
│   │   │   ├── config/
│   │   │   │   ├── index.ts            # Variables d'env centralisées ✅
│   │   │   │   └── prisma.ts           # Client Prisma singleton ✅
│   │   │   ├── middlewares/
│   │   │   │   └── auth.middleware.ts  # JWT cookie + admin guard ✅
│   │   │   └── utils/
│   │   ├── types/
│   │   │   └── auth.types.ts           # Interfaces TypeScript backend ✅
│   │   ├── app.ts                      # Express + CORS + cookie-parser ✅
│   │   └── server.ts                   # Point d'entrée serveur
│   ├── prisma/
│   │   ├── schema.prisma               # Schéma DB — 6 tables ✅
│   │   └── migrations/                 # Historique SQL — init ✅
│   ├── .env                            # Variables d'environnement (non commité)
│   ├── .env.example                    # Template variables d'environnement
│   ├── nodemon.json                    # Configuration hot reload
│   ├── tsconfig.json                   # Configuration TypeScript
│   └── package.json                    # Dépendances backend
│
├── .gitignore                          # Fichiers exclus de Git
├── package.json                        # Workspaces npm + scripts racine
└── README.md                           # Ce fichier

API Endpoints
Authentification — /api/auth
MéthodeRouteAccèsDescriptionGET/healthPublicVérification que le serveur tournePOST/api/auth/registerPublicCréer un compte — définit le cookie httpOnlyPOST/api/auth/loginPublicSe connecter — définit le cookie httpOnlyPOST/api/auth/logoutPublicSe déconnecter — supprime le cookieGET/api/auth/me🔒 Cookie JWTRécupérer l'utilisateur connecté
Sécurité des cookies
Le token JWT est stocké dans un cookie httpOnly — inaccessible à JavaScript :
Cookie: adminflow_token=eyJhbGci...
  httpOnly: true     ← JavaScript ne peut pas lire ce cookie
  secure: true       ← HTTPS uniquement en production
  sameSite: lax      ← Protection CSRF
  maxAge: 7 jours    ← Expiration automatique

Base de données
Tables PostgreSQL (Supabase)
TableDescriptionStatutusersComptes avec role (USER/ADMIN) et plan (FREE/PLUS/PRO)✅profilesInformations professionnelles (SIREN, régime fiscal)✅documentsDocuments uploadés et analysés par l'IA✅deadlinesÉchéances détectées automatiquement✅integrationsConnecteurs vers des services externes✅ai_logsJournal de toutes les analyses IA✅
Connexion Supabase
DATABASE_URL → port 5432 + pgbouncer=true  (Session Pooler — compatible Prisma)
DIRECT_URL   → port 5432                   (Connexion directe pour migrations)

⚠️ Le port 6543 (Transaction Pooler) est incompatible avec les prepared statements de Prisma.


Installation
Prérequis

Node.js >= 22 — nodejs.org
npm >= 10 — inclus avec Node.js
Git — git-scm.com
Ollama — ollama.ai puis ollama pull llama3
Compte Supabase gratuit — supabase.com

Étapes d'installation
bash# 1. Cloner le projet
git clone https://github.com/TON_USER/AdminFlow-AI.git
cd AdminFlow-AI

# 2. Installer les dépendances frontend
cd client && npm install

# 3. Installer les dépendances backend
cd ../server && npm install

# 4. Configurer les variables d'environnement
# Créer client/.env et server/.env (voir section ci-dessous)

# 5. Appliquer les migrations Prisma
cd server && npx prisma migrate deploy

# 6. Lancer l'application (2 terminaux)
# Terminal 1 — Frontend
cd client && npm run dev      # → http://localhost:5173

# Terminal 2 — Backend
cd server && npm run dev      # → http://localhost:3001
Variables d'environnement
Créer client/.env :
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://TONPROJET.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
Créer server/.env :
DATABASE_URL=postgresql://postgres.TONPROJET:MOTDEPASSE@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.TONPROJET:MOTDEPASSE@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://TONPROJET.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_KEY=sb_secret_...
JWT_SECRET=change-this-in-production-minimum-32-chars
PORT=3001
NODE_ENV=development

Les valeurs se trouvent dans Supabase → Settings → API et Settings → Database

Vérification
bash# Backend opérationnel
curl http://localhost:3001/health
# → { "status": "OK", "app": "AdminFlow AI", "version": "1.0.0" }

# Test inscription (Git Bash)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@adminflow.fr","password":"AdminFlow@2026"}'
Politique de mot de passe
Pour la sécurité des données administratives confidentielles :
✓ 12 caractères minimum
✓ Au moins une lettre majuscule
✓ Au moins une lettre minuscule
✓ Au moins un chiffre
✓ Au moins un caractère spécial (!@#$%^&*...)

Sécurité
MesureImplémentationToken JWTCookie httpOnly — inaccessible au JavaScriptMots de passeHachés avec bcrypt (12 rounds) — jamais en clairHeaders HTTPSécurisés par Helmet (XSS, clickjacking, MIME)CORSSeul localhost:5173 autorisé en développementCSRFCookie sameSite: laxValidationZod côté frontend ET backendClé secrèteSERVICE_KEY Supabase uniquement côté serveur

Accessibilité (WCAG 2.1 AA)
RègleImplémentationFocus visibleOutline 2px bleu sur tous les éléments interactifsNavigation clavierSkip-link + ordre de focus logiqueLecteurs d'écranaria-label, aria-live, aria-invalid, role=alertTaille des ciblesMinimum 44x44px sur tous les boutonsContrasteRatio minimum 4.5:1 texte/fondAnimationsprefers-reduced-motion respecté

Monétisation
PlanPrixDocuments/moisStockageFREEGratuit5100 MBPLUSÀ définir501 GBPROÀ définirIllimité10 GB

Roadmap

 Phase 1 — Architecture & Setup
 Phase 2 — Base de données & Authentification (backend + frontend terminés)
 Phase 3 — Upload + OCR
 Phase 4 — Pipeline IA (Ollama + Llama 3)
 Phase 5 — Détection et gestion des échéances
 Phase 6 — UI complète
 Phase 7 — Dashboard Administrateur
 Phase 8 — Intégrations externes
 Phase 9 — Optimisation & Déploiement


Contribuer
bash# Créer une branche feature depuis dev
git checkout dev
git checkout -b feat/ma-fonctionnalite

# Coder, tester, commiter (Conventional Commits)
git commit -m "feat(scope): description claire"

# Push et ouvrir une Pull Request vers dev
git push origin feat/ma-fonctionnalite

Licence
MIT