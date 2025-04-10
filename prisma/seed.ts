import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('password', roundsOfHashing);

  // Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'tenant-1' },
    update: {},
    create: {
      slug: 'tenant-1',
      name: 'Hani Ahmed Co',
    },
  });

  // Create Users First
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create Editors for tenants
  const editor = await prisma.user.upsert({
    where: { email: 'editor@editor.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'editor@editor.com',
      name: 'Editor',
      password: hashedPassword,
      role: Role.EDITOR,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@viewer.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'viewer@viewer.com',
      name: 'Viewer',
      password: hashedPassword,
      role: Role.VIEWER,
    },
  });

  // Create dummy posts
  const post1 = await prisma.post.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      author_id: editor.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      author_id: editor.id,
      published: true,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      author_id: editor.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      author_id: editor.id,
      published: true,
    },
  });

  console.log({ tenant, admin, editor, viewer, post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect to ensure disconnection after async operation
    await prisma.$disconnect();
  });
