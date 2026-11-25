-- CreateTable
CREATE TABLE "kort" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "navn" TEXT NOT NULL,

    CONSTRAINT "kort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bruker_kort" (
    "id" TEXT NOT NULL,
    "brukerId" TEXT NOT NULL,
    "kortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bruker_kort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bruker_profil" (
    "id" TEXT NOT NULL,
    "brukerId" TEXT NOT NULL,
    "trumfKoblet" BOOLEAN NOT NULL,
    "kunSas" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bruker_profil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kort_kode_key" ON "kort"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "bruker_kort_brukerId_kortId_key" ON "bruker_kort"("brukerId", "kortId");

-- CreateIndex
CREATE UNIQUE INDEX "bruker_profil_brukerId_key" ON "bruker_profil"("brukerId");

-- AddForeignKey
ALTER TABLE "bruker_kort" ADD CONSTRAINT "bruker_kort_brukerId_fkey" FOREIGN KEY ("brukerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bruker_kort" ADD CONSTRAINT "bruker_kort_kortId_fkey" FOREIGN KEY ("kortId") REFERENCES "kort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bruker_profil" ADD CONSTRAINT "bruker_profil_brukerId_fkey" FOREIGN KEY ("brukerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
