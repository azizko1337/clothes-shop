import { PrismaClient } from '../src/generated/client/client';
import { authenticator } from 'otplib';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  // Generate a secret. In a real app, you might want to specify this or output it.
  // For this setup, I'll generate one and print it so the user can see it.
  const secret = authenticator.generateSecret();

  const user = await prisma.user.upsert({
    where: { username },
    update: {}, // Don't update if exists, just print the existing one? 
                // Actually if it exists, we won't know the secret unless we read it.
                // But for simplicity, let's just create if not exists.
    create: {
      username,
      totpSecret: secret,
    },
  });

  console.log('Admin user setup:');
  console.log(`Username: ${user.username}`);
  if (user.totpSecret === secret) {
      console.log(`TOTP Secret: ${user.totpSecret}`);
      console.log('Scan this secret in your Authenticator app (Google Authenticator, Authy, etc.)');
  } else {
      console.log('User already existed. TOTP secret not changed.');
      console.log(`Existing Secret: ${user.totpSecret}`);
  }

  // Create a collection
  const collection = await prisma.collection.create({
    data: {
      name: 'Summer 2025',
      description: 'The hottest looks for the summer.',
      releaseDate: new Date('2025-06-01'),
    },
  });

  console.log(`Created collection: ${collection.name}`);

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Summer T-Shirt',
      description: 'A cool t-shirt for hot days.',
      composition: '100% Cotton',
      price: 29.99,
      collectionId: collection.id,
      sizes: {
        create: [
          { size: 'S' },
          { size: 'M' },
          { size: 'L' },
        ],
      },
      images: {
        create: [
          { url: '/images/tshirt-front.jpg' },
          { url: '/images/tshirt-back.jpg' },
        ],
      },
    },
  });
  
  console.log(`Created product: ${product1.name}`);
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
