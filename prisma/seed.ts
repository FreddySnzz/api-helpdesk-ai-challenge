import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashPassword = await bcrypt.hash('senha123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@helpdesk.com' },
    update: {},
    create: {
      email: 'admin@helpdesk.com',
      name: 'Administrador',
      password: hashPassword,
      role: 'ADMIN',
    },
  });

  const solicitante = await prisma.user.upsert({
    where: { email: 'solicitante@helpdesk.com' },
    update: {},
    create: {
      email: 'solicitante@helpdesk.com',
      name: 'João Solicitante',
      password: hashPassword,
      role: 'SOLICITANTE',
    },
  });

  console.log({ admin, solicitante });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });