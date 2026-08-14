-- CreateTable
CREATE TABLE "VerifiedSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "rechargeCode" TEXT,
    "currency" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "VerifiedSubmission_type_idx" ON "VerifiedSubmission"("type");

-- CreateIndex
CREATE INDEX "VerifiedSubmission_createdAt_idx" ON "VerifiedSubmission"("createdAt");
