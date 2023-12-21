-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DeveloperToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DeveloperToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DeveloperToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToProject_AB_unique" ON "_DeveloperToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToProject_B_index" ON "_DeveloperToProject"("B");
