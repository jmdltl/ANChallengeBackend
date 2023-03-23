// Initial set up seed, do not add anything not needed for a primed application
import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { ROLES } from '../../config/permissionsAndRoles';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function roles() {
  for (const [key, value] of Object.entries(ROLES)) {
    const permissions = value.map((key) => {
      return {
        where: {
          key,
        },
        create: {
          key,
        },
      };
    });

    await prisma.roles.create({
      data: {
        key,
        permissions: {
          connectOrCreate: permissions,
        },
      },
    });
  }
}

async function createSuperAdmin() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADDMIN_PASSWORD || 'UnoDosTres!',
    10,
  );

  await prisma.user.create({
    data: {
      email: process.env.ADDMIN_EMAIL || 'super@arku.com',
      password: hashedPassword,
      roles: {
        connectOrCreate: {
          where: {
            key: 'superAdmin',
          },
          create: {
            key: 'superAdmin',
          },
        },
      },
    },
  });
}

async function main() {
  await roles();
  await createSuperAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
