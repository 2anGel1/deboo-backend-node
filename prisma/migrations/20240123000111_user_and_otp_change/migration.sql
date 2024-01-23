/*
  Warnings:

  - You are about to drop the column `codeVerified` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `pinHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Otp` DROP COLUMN `codeVerified`,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `passwordHash`,
    ADD COLUMN `pinHash` VARCHAR(191) NOT NULL;
