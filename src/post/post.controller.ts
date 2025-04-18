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
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/types/express';
import { EditorGuard } from 'src/auth/guards/editor.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FindPostsDto } from './dto/find-post.dto';
import { ApiAuthWithTenant } from 'src/decorators/api-auth-with-tenant.decorator';

@ApiTags('posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiAuthWithTenant()
  @UseGuards(JwtAuthGuard, EditorGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostEntity })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return new PostEntity(
      await this.postService.create(
        user.tenantId,
        createPostDto,
        user.id,
        user.role,
      ),
    );
  }

  @Get()
  @ApiAuthWithTenant()
  @ApiOperation({ summary: 'Get all posts with pagination and filtering' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll(
    @Query() findPostsDto: FindPostsDto,
    @Request() req: AuthRequest,
  ) {
    const { id: userId, tenantId } = req.user;
    const posts = await this.postService.findAll(tenantId, findPostsDto);

    return posts.map((post) => new PostEntity({ ...post, author_id: userId }));
  }

  @Get(':id')
  @ApiAuthWithTenant()
  @ApiOperation({ summary: 'Get post id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    const post = await this.postService.findOne(user.tenantId, +id);
    if (!post) {
      throw new NotFoundException(`Post with ${id} does not exist.`);
    }
    return new PostEntity({ ...post, author_id: user.id });
  }

  @Patch(':id')
  @ApiAuthWithTenant()
  @ApiOperation({ summary: 'Edit post id' })
  @UseGuards(JwtAuthGuard, AdminGuard, EditorGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return new PostEntity(
      await this.postService.update(
        user.tenantId,
        +id,
        updatePostDto,
        user.id,
        user.role,
      ),
    );
  }

  @Delete(':id')
  @ApiAuthWithTenant()
  @ApiOperation({ summary: 'Delete post id' })
  @UseGuards(JwtAuthGuard, AdminGuard, EditorGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return new PostEntity(
      await this.postService.remove(user.tenantId, +id, user.id, user.role),
    );
  }
}
