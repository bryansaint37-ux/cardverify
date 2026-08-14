-- CreateTable
CREATE TABLE "VerifiedSubmission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "rechargeCode" TEXT,
    "currency" TEXT,
    "email" TEXT,
    "formatValid" BOOLEAN NOT NULL DEFAULT true,
    "verdict" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifiedSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerifiedSubmission_type_idx" ON "VerifiedSubmission"("type");

-- CreateIndex
CREATE INDEX "VerifiedSubmission_createdAt_idx" ON "VerifiedSubmission"("createdAt");
