-- CreateTable
CREATE TABLE "DemoSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "DemoSubmission_type_idx" ON "DemoSubmission"("type");

-- CreateIndex
CREATE INDEX "DemoSubmission_createdAt_idx" ON "DemoSubmission"("createdAt");
