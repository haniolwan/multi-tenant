import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Param,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiAuthWithTenant } from 'src/decorators/api-auth-with-tenant.decorator';
import { AuthRequest } from 'src/types/express';

@Controller('user')
@ApiTags('admin/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOkResponse({ type: AuthEntity })
  register(
    @Body() { name, email, password }: CreateUserDto,
    @Request() req: AuthRequest,
  ) {
    const tenantId = req['tenantId'];

    return this.usersService.register(Number(tenantId), name, email, password);
  }

  @Get()
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(@Request() req: AuthRequest) {
    const tenantId = Number(req['tenantId']);
    const users = await this.usersService.findAll(tenantId);
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOkResponse({ type: UserEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const tenantId = Number(req['tenantId']);

    const user = await this.usersService.findOne(tenantId, id);
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist.`);
    }
    return new UserEntity(user);
  }

  @Patch(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth() // decorator protected
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthRequest,
  ) {
    const tenantId = Number(req['tenantId']);

    return new UserEntity(
      await this.usersService.update(tenantId, id, updateUserDto),
    );
  }

  @Delete(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOkResponse({ type: UserEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const tenantId = Number(req['tenantId']);

    return new UserEntity(await this.usersService.remove(tenantId, id));
  }
}
