import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiAuthWithTenant } from 'src/decorators/api-auth-with-tenant.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiAuthWithTenant()
  @ApiOkResponse({ type: AuthEntity })
  login(
    @Body() { email, password }: LoginDto,
    @Headers('x-tenant-id') tenantId: number,
  ) {
    return this.authService.login(email, password, Number(tenantId));
  }

  @Get(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.authService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist.`);
    }
    return new UserEntity(user);
  }

  @Patch(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth() // decorator protected
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.authService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiAuthWithTenant()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.authService.remove(id));
  }
}
