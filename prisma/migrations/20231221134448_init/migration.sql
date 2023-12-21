-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "PortfolioItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Developer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DeveloperToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DeveloperToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DeveloperToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PortfolioItemToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PortfolioItemToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "PortfolioItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PortfolioItemToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_email_key" ON "Developer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToSkill_AB_unique" ON "_DeveloperToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToSkill_B_index" ON "_DeveloperToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PortfolioItemToSkill_AB_unique" ON "_PortfolioItemToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_PortfolioItemToSkill_B_index" ON "_PortfolioItemToSkill"("B");
