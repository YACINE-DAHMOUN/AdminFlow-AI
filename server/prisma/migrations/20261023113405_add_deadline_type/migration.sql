-- CreateEnum
CREATE TYPE "DeadlineType" AS ENUM ('URSSAF', 'IMPOTS', 'BANQUE', 'FACTURE', 'COURRIER', 'OTHER');

-- AlterTable
ALTER TABLE "deadlines" ADD COLUMN     "type" "DeadlineType" NOT NULL DEFAULT 'OTHER';
