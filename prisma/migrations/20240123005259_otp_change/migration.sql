/*
  Warnings:

  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `userphone` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Otp` DROP COLUMN `userId`,
    ADD COLUMN `userphone` VARCHAR(191) NOT NULL;
