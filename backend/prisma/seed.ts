// import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.ADMIN_PASSWORD!;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'a87chaud@uwaterloo.ca' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'a87chaud@uwaterloo.ca',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  console.log(' Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
