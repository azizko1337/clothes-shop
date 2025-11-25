import { PrismaClient } from '../src/generated/client/client';
import { authenticator } from 'otplib';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    console.log('Admin user found:');
    console.log(`Username: ${user.username}`);
    console.log(`TOTP Secret: ${user.totpSecret}`);
    
    const token = authenticator.generate(user.totpSecret);
    console.log(`Current TOTP Token: ${token}`);
  } else {
    console.log('Admin user not found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
