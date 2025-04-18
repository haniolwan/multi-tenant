import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthRequest } from 'src/types/express';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a user', () => {
    expect(
      controller.register({
        name: 'Hani',
        email: 'email@example.com',
        password: 'password',
        role: 'VIEWER',
      }),
    ).toEqual({
      id: expect.any(Number),
      name: 'Hani',
    });
  });

  expect(mockUserService.create).toHaveBeenCalledWith();
});
