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

  const fixturesDir = path.join(__dirname, 'fixtures');
  if (fs.existsSync(fixturesDir)) {
    const collectionDirs = fs.readdirSync(fixturesDir).filter(f => fs.statSync(path.join(fixturesDir, f)).isDirectory());

    for (const collectionDir of collectionDirs) {
      const collectionPath = path.join(fixturesDir, collectionDir);
      
      // Parse collection name and date
      const parts = collectionDir.split('-');
      let collectionName = collectionDir;
      let releaseDate = new Date();

      if (parts.length >= 3 && parts[0] === 'collection') {
        const season = parts[1];
        const year = parseInt(parts[2]);
        const seasonCapitalized = season.charAt(0).toUpperCase() + season.slice(1);
        collectionName = `${seasonCapitalized} ${year}`;
        
        const monthMap: Record<string, number> = {
          'spring': 2,
          'summer': 5,
          'autumn': 8,
          'winter': 11
        };
        const month = monthMap[season.toLowerCase()] || 0;
        releaseDate = new Date(year, month, 1);
      } else {
          collectionName = collectionDir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }

      const collection = await prisma.collection.create({
        data: {
          name: collectionName,
          description: `Kolekcja ${collectionName}`,
          releaseDate: releaseDate,
        },
      });
      console.log(`Created collection: ${collection.name}`);

      const productDirs = fs.readdirSync(collectionPath).filter(f => fs.statSync(path.join(collectionPath, f)).isDirectory());

      for (const productDir of productDirs) {
        const productPath = path.join(collectionPath, productDir);
        
        const productName = productDir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        const isCd = productDir.startsWith('cd-album');
        const price = isCd ? 49.99 : 199.99;
        const composition = isCd ? 'Plastic' : '100% Bawełna';
        
        const files = fs.readdirSync(productPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort();
        const modelFile = files.find(f => /\.(glb|gltf)$/i.test(f));

        const imagesData = imageFiles.map((file, index) => {
            const filePath = path.join(productPath, file);
            const ext = path.extname(file).toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === '.png') mimeType = 'image/png';
            if (ext === '.webp') mimeType = 'image/webp';
            return {
                data: fs.readFileSync(filePath),
                mimeType,
                order: index
            };
        });

        let modelData = null;
        let modelMimeType = null;
        if (modelFile) {
            modelData = fs.readFileSync(path.join(productPath, modelFile));
            modelMimeType = modelFile.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json';
        }

        const sizes = isCd ? [] : ['S', 'M', 'L', 'XL'];

        const product = await prisma.product.create({
            data: {
                name: productName,
                description: `Opis dla ${productName}`,
                composition: composition,
                price: price,
                collectionId: collection.id,
                sizes: {
                    create: sizes.map(s => ({ size: s }))
                },
                images: {
                    create: imagesData
                },
                modelData: modelData,
                modelMimeType: modelMimeType
            }
        });
        console.log(`Created product: ${product.name}`);
      }
    }
  }
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
