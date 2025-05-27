/*
  Warnings:

  - Added the required column `shareId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "shareId" TEXT NOT NULL;
