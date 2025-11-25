-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "modelUrl" TEXT,
    "modelData" BLOB,
    "modelMimeType" TEXT,
    "glbAttribution" TEXT,
    "glbLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "collectionId" INTEGER NOT NULL,
    CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("collectionId", "composition", "createdAt", "description", "glbAttribution", "glbLink", "id", "modelData", "modelMimeType", "modelUrl", "name", "price", "updatedAt") SELECT "collectionId", "composition", "createdAt", "description", "glbAttribution", "glbLink", "id", "modelData", "modelMimeType", "modelUrl", "name", "price", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
