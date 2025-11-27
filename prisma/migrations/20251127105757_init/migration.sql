/*
  Warnings:

  - You are about to drop the column `linkedStepId` on the `Step` table. All the data in the column will be lost.
  - You are about to drop the column `timeSensitiveColorsId` on the `Step` table. All the data in the column will be lost.
  - You are about to drop the column `unCheckOptionId` on the `Step` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Step" DROP COLUMN "linkedStepId",
DROP COLUMN "timeSensitiveColorsId",
DROP COLUMN "unCheckOptionId",
ADD COLUMN     "linkedStep" JSONB;
