-- AlterTable
ALTER TABLE "bruker_profil" ADD COLUMN     "amexForbrukOre" INTEGER,
ADD COLUMN     "bonuspoengIDag" INTEGER,
ADD COLUMN     "bonuspoengSiste12Mnd" INTEGER,
ADD COLUMN     "harCompanionTicket" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "harFlyPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "poengmal" INTEGER,
ADD COLUMN     "trumfKronerOre" INTEGER;
