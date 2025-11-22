import prisma from '../prisma/client';
import { hashPassword } from '../utils/password';

async function main() {
  const adminEmail = 'admin@caseflow.local';
  const adminPw = 'adminpassword';

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: await hashPassword(adminPw),
      role: 'ADMIN'
    }
  });

  console.log('Seeded admin:', adminEmail);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
