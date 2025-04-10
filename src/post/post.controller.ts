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

@ApiTags('posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EditorGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostEntity })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return new PostEntity(
      await this.postService.create(createPostDto, user.id, user.role),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filtering' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll(
    @Query() findPostsDto: FindPostsDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    const posts = await this.postService.findAll(user.id, findPostsDto);
    return posts.map((post) => new PostEntity({ ...post, author_id: user.id }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    const post = await this.postService.findOne(+id);
    if (!post) {
      throw new NotFoundException(`Post with ${id} does not exist.`);
    }
    return new PostEntity({ ...post, author_id: user.id });
  }

  @Patch(':id')
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
      await this.postService.update(+id, updatePostDto, user.id, user.role),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard, EditorGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return new PostEntity(
      await this.postService.remove(+id, user.id, user.role),
    );
  }
}
