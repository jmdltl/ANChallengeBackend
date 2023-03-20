/*
  Warnings:

  - You are about to drop the column `english_level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resume_link` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tech_skills` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "english_level",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "resume_link",
DROP COLUMN "tech_skills",
ADD COLUMN     "englishLevel" "EnglishLevel",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "resumeLink" TEXT,
ADD COLUMN     "techSkills" TEXT;
