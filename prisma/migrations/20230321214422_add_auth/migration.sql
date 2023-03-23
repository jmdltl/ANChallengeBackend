-- CreateTable
CREATE TABLE "PasswordToken" (
    "id" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RolesToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionsToRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_key_key" ON "Roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_key_key" ON "Permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_RolesToUser_AB_unique" ON "_RolesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RolesToUser_B_index" ON "_RolesToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToRoles_AB_unique" ON "_PermissionsToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToRoles_B_index" ON "_PermissionsToRoles"("B");

-- AddForeignKey
ALTER TABLE "PasswordToken" ADD CONSTRAINT "PasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUser" ADD CONSTRAINT "_RolesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
