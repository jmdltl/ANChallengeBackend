-- CreateEnum
CREATE TYPE "AssignationType" AS ENUM ('ASSIGNED', 'REMOVED');

-- CreateTable
CREATE TABLE "AccountAssignations" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "AccountAssignations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountAssignationsLogs" (
    "id" SERIAL NOT NULL,
    "type" "AssignationType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountAssignationId" INTEGER NOT NULL,

    CONSTRAINT "AccountAssignationsLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountAssignations" ADD CONSTRAINT "AccountAssignations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountAssignations" ADD CONSTRAINT "AccountAssignations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountAssignationsLogs" ADD CONSTRAINT "AccountAssignationsLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountAssignationsLogs" ADD CONSTRAINT "AccountAssignationsLogs_accountAssignationId_fkey" FOREIGN KEY ("accountAssignationId") REFERENCES "AccountAssignations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
