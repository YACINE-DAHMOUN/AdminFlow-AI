-- Active RLS sur toutes les tables du schéma public.
-- Sans aucune règle (policy), tout accès par l'API Supabase (clé anon) est refusé.
-- Prisma se connecte avec le rôle postgres, propriétaire des tables : il n'est pas concerné.

ALTER TABLE "users"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "deadlines"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "integrations"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_logs"            ENABLE ROW LEVEL SECURITY;

-- _prisma_migrations n'existe pas dans la shadow database de Prisma :
-- on n'active RLS que si la table est présente.

DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;