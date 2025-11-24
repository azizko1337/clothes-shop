import { PrismaClient } from '../src/generated/client/client';
import { authenticator } from 'otplib';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

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
      name: 'LATO 2025',
      description: 'Najgorętsze stylizacje na lato.',
      releaseDate: new Date('2025-07-01'),
    },
  });

  console.log(`Created collection: ${collection.name}`);

  const fixturesDir = path.join(__dirname, 'fixtures');
  const image1 = fs.readFileSync(path.join(fixturesDir, 'product_image_1.jpg'));
  const image2 = fs.readFileSync(path.join(fixturesDir, 'product_image_2.jpg'));
  const image3 = fs.readFileSync(path.join(fixturesDir, 'product_image_3.jpg'));
  const model3d = fs.readFileSync(path.join(fixturesDir, 'product_model.glb'));

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Bluza z kapturem LATO 2025',
      description: 'Stylowa bluza z kapturem idealna na letnie wieczory.',
      composition: '100% Bawełna',
      price: 199.99,
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
          { 
            data: image1,
            mimeType: 'image/jpeg',
            order: 0
          },
          { 
            data: image2,
            mimeType: 'image/jpeg',
            order: 1
          },
          { 
            data: image3,
            mimeType: 'image/jpeg',
            order: 2
          },
        ],
      },
      modelData: model3d,
      modelMimeType: 'model/gltf-binary',
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
