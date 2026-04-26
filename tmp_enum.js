const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`ALTER TYPE "LessonType" ADD VALUE IF NOT EXISTS 'NOTEBOOK'`;
    console.log('Enum updated successfully!');
  } catch(e) {
    if (e.message && e.message.includes('already exists')) {
       console.log('Already exists!');
    } else {
       console.error('Error:', e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
