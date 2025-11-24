/*
  Warnings:

  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_OrderToProduct_B_index";

-- DropIndex
DROP INDEX "_OrderToProduct_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrderToProduct";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    "totalProductsPrice" REAL NOT NULL,
    "deliveryPrice" REAL NOT NULL
);
INSERT INTO "new_Order" ("address", "createdAt", "deliveredAt", "deliveryPrice", "id", "shippedAt", "status", "totalProductsPrice") SELECT "address", "createdAt", "deliveredAt", "deliveryPrice", "id", "shippedAt", "status", "totalProductsPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
