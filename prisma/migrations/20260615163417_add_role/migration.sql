-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- AlterTable
ALTER TABLE "User_Data" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
