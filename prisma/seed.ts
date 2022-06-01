import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { id: 1 },
    update: {
      name: 'Administrador',
    },
    create: {
      id: 1,
      name: 'Administrador',
    },
  });
  const med = await prisma.role.upsert({
    where: { id: 2 },
    update: {
      name: 'Médico',
    },
    create: {
      id: 2,
      name: 'Médico',
    },
  });
  const tech = await prisma.role.upsert({
    where: { id: 3 },
    update: {
      name: 'Técnico',
    },
    create: {
      id: 3,
      name: 'Técnico',
    },
  });
  const alice = await prisma.user.upsert({
    where: { email: 'ingrid.morejon@gmail.com' },
    update: {},
    create: {
      email: 'ingrid.morejon@gmail.com',
      firstName: 'Ingrid',
      lastName: 'Morejon',
      roleId: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
