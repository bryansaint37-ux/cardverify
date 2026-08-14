-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DemoSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "rechargeCode" TEXT,
    "currency" TEXT,
    "email" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DemoSubmission" ("amount", "createdAt", "id", "reference", "type") SELECT "amount", "createdAt", "id", "reference", "type" FROM "DemoSubmission";
DROP TABLE "DemoSubmission";
ALTER TABLE "new_DemoSubmission" RENAME TO "DemoSubmission";
CREATE INDEX "DemoSubmission_type_idx" ON "DemoSubmission"("type");
CREATE INDEX "DemoSubmission_createdAt_idx" ON "DemoSubmission"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
