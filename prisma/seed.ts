import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('password', roundsOfHashing);

  // Create Tenant
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'tenant-1' },
    update: {},
    create: {
      slug: 'tenant-1',
      name: 'Tenant 1',
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'tenant-2' },
    update: {},
    create: {
      slug: 'tenant-2',
      name: 'Tenant 2',
    },
  });

  // Create Users First
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant1.id,
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant2.id,
    },
  });

  // Create Editors for tenants
  const editor1 = await prisma.user.upsert({
    where: { email: 'editor@editor.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'editor@editor.com',
      name: 'Editor',
      password: hashedPassword,
      role: Role.EDITOR,
      tenantId: tenant1.id,
    },
  });

  // Create Editors for tenants
  const editor2 = await prisma.user.upsert({
    where: { email: 'editor@editor.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'editor@editor.com',
      name: 'Editor',
      password: hashedPassword,
      role: Role.EDITOR,
      tenantId: tenant2.id,
    },
  });

  const viewer1 = await prisma.user.upsert({
    where: { email: 'viewer@viewer.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'viewer@viewer.com',
      name: 'Viewer',
      password: hashedPassword,
      role: Role.VIEWER,
      tenantId: tenant1.id,
    },
  });

  const viewer2 = await prisma.user.upsert({
    where: { email: 'viewer@viewer.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'viewer@viewer.com',
      name: 'Viewer',
      password: hashedPassword,
      role: Role.VIEWER,
      tenantId: tenant2.id,
    },
  });

  // Create dummy posts
  const post1 = await prisma.post.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      author_id: editor1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      author_id: editor1.id,
      published: true,
      tenantId: tenant1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      author_id: editor1.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      author_id: editor1.id,
      published: true,
      tenantId: tenant1.id,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      author_id: editor2.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      content:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      author_id: editor2.id,
      published: true,
      tenantId: tenant2.id,
    },
  });

  const post4 = await prisma.post.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      author_id: editor2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      content:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      author_id: editor2.id,
      published: true,
      tenantId: tenant2.id,
    },
  });

  console.log({
    tenant1,
    admin1,
    editor1,
    viewer1,
    post1,
    post2,
    tenant2,
    admin2,
    editor2,
    viewer2,
    post3,
    post4,
  });
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
