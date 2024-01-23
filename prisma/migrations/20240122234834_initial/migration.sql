/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `signupMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Candidat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contrat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entreprise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entretien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Freelancer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OffreEmploi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proposition` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phonenumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Contrat` DROP FOREIGN KEY `Contrat_entrepriseId_fkey`;

-- DropForeignKey
ALTER TABLE `Contrat` DROP FOREIGN KEY `Contrat_freelancerId_fkey`;

-- DropForeignKey
ALTER TABLE `Entretien` DROP FOREIGN KEY `Entretien_candidatId_fkey`;

-- DropForeignKey
ALTER TABLE `Entretien` DROP FOREIGN KEY `Entretien_entrepriseId_fkey`;

-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_candidatId_fkey`;

-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_entrepriseId_fkey`;

-- DropForeignKey
ALTER TABLE `OffreEmploi` DROP FOREIGN KEY `OffreEmploi_entrepriseId_fkey`;

-- DropForeignKey
ALTER TABLE `Projet` DROP FOREIGN KEY `Projet_entrepriseId_fkey`;

-- DropForeignKey
ALTER TABLE `Proposition` DROP FOREIGN KEY `Proposition_freelancerId_fkey`;

-- DropForeignKey
ALTER TABLE `Proposition` DROP FOREIGN KEY `Proposition_projetId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `User_userName_key` ON `User`;

-- AlterTable
ALTER TABLE `Session` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `active`,
    DROP COLUMN `firstName`,
    DROP COLUMN `image`,
    DROP COLUMN `lastName`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `signupMethod`,
    DROP COLUMN `userName`,
    DROP COLUMN `verifiedAt`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phonenumber` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `passwordHash` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `AccountVerification`;

-- DropTable
DROP TABLE `Candidat`;

-- DropTable
DROP TABLE `Contrat`;

-- DropTable
DROP TABLE `Entreprise`;

-- DropTable
DROP TABLE `Entretien`;

-- DropTable
DROP TABLE `Freelancer`;

-- DropTable
DROP TABLE `Note`;

-- DropTable
DROP TABLE `OffreEmploi`;

-- DropTable
DROP TABLE `PasswordReset`;

-- DropTable
DROP TABLE `Projet`;

-- DropTable
DROP TABLE `Proposition`;

-- CreateTable
CREATE TABLE `Otp` (
    `type` ENUM('ACCOUNT_CREATION', 'PASSWORD_REST') NOT NULL DEFAULT 'ACCOUNT_CREATION',
    `id` VARCHAR(191) NOT NULL,
    `codeVerified` BOOLEAN NOT NULL DEFAULT false,
    `reset` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,
    `expires` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_phonenumber_key` ON `User`(`phonenumber`);

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
