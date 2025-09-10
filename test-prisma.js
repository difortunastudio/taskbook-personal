const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('Available models:');
Object.getOwnPropertyNames(prisma).forEach(prop => {
  if (!prop.startsWith('_') && !prop.startsWith('$') && typeof prisma[prop] === 'object') {
    console.log('- ' + prop);
  }
});

console.log('\nChecking businessRecord specifically:');
console.log('businessRecord exists:', 'businessRecord' in prisma);
console.log('BusinessRecord exists:', 'BusinessRecord' in prisma);

prisma.$disconnect();
