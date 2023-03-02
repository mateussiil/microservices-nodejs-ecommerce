import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' },
    { name: 'User 4', email: 'user4@example.com' },
    { name: 'User 5', email: 'user5@example.com' },
    { name: 'User 6', email: 'user6@example.com' },
    { name: 'User 7', email: 'user7@example.com' },
    { name: 'User 8', email: 'user8@example.com' },
    { name: 'User 9', email: 'user9@example.com' },
    { name: 'User 10', email: 'user10@example.com' },
  ];

  for (let user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
