import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  create(createTenantDto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return this.prisma.tenant.update({ where: { id }, data: updateTenantDto });
  }

  remove(id: number) {
    return this.prisma.tenant.delete({ where: { id } });
  }
}
