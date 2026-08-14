-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VerifiedSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "rechargeCode" TEXT,
    "currency" TEXT,
    "email" TEXT,
    "formatValid" BOOLEAN NOT NULL DEFAULT true,
    "verdict" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_VerifiedSubmission" ("amount", "createdAt", "currency", "email", "id", "rechargeCode", "reference", "type") SELECT "amount", "createdAt", "currency", "email", "id", "rechargeCode", "reference", "type" FROM "VerifiedSubmission";
DROP TABLE "VerifiedSubmission";
ALTER TABLE "new_VerifiedSubmission" RENAME TO "VerifiedSubmission";
CREATE INDEX "VerifiedSubmission_type_idx" ON "VerifiedSubmission"("type");
CREATE INDEX "VerifiedSubmission_createdAt_idx" ON "VerifiedSubmission"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
