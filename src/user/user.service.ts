import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({ data: createUserDto });
  }

  async register(
    tenantId: number,
    name: string,
    email: string,
    password: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  findAll(tenantId: number | undefined) {
    return this.prisma.user.findMany({ where: { tenantId } });
  }

  findOne(tenantId: number, id: number) {
    return this.prisma.user.findUnique({ where: { tenantId: tenantId, id } });
  }

  async update(tenantId: number, id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prisma.user.update({
      where: { tenantId: tenantId, id },
      data: updateUserDto,
    });
  }

  remove(tenantId: number, id: number) {
    return this.prisma.user.delete({ where: { tenantId: tenantId, id } });
  }
}
