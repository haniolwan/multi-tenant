import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

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
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Should create a user', () => {
    expect(
      controller.login(
        {
          email: 'email@example.com',
          password: 'password',
        },
        1,
      ),
    ).toEqual({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
