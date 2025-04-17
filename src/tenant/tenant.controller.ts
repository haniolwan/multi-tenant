import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@Controller('tenant')
export class TenantController {
  constructor(
    private jwtService: JwtService,
    private readonly tenantService: TenantService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Register tenant id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const tenant = await this.tenantService.findOne(+id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ${id} does not exist.`);
    }
    const payload = { tenantId: tenant.id };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
