/*
  Warnings:

  - Added the required column `refreshToken` to the `User_Data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Data" ADD COLUMN     "refreshToken" TEXT NOT NULL;
