import { create } from 'src/user/dto/create-user.dto';
import { vi } from 'vitest';

vi.mock('../libs/prisma');

test('createUser should return the generated user', async () => {
  const newUser = { email: 'user@prisma.io', name: 'Prisma Fan' };
  const user = await create(newUser);
  expect(user).toStrictEqual({ ...newUser, id: 1 });
});
