import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async userHasPermission(postId: number, userId: number, userRole: Role) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found.`);
    }

    if (userRole === Role.ADMIN) {
      return true;
    }

    if (userRole === Role.EDITOR && post.author.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this post.',
      );
    }

    if (post.author.id === userId) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to edit this post.',
    );
  }

  create(
    tenantId: number,
    createPostDto: CreatePostDto,
    authorId: number,
    userRole: Role,
  ) {
    if (userRole !== Role.EDITOR && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to edit this post.',
      );
    }
    return this.prisma.post.create({
      data: { tenantId: tenantId, ...createPostDto, author_id: authorId },
    });
  }

  filterPosts(
    page: string,
    pageSize: string,
    title?: string,
    published?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);

    const where: Prisma.PostWhereInput = {};

    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (published !== undefined) {
      where.published = published === 'true';
    }

    return {
      skip,
      where,
    };
  }

  async findAll(
    tenantId: number,
    {
      page,
      pageSize,
      title,
      published,
    }: { page: string; pageSize: string; title?: string; published?: string },
  ) {
    const { skip, where } = this.filterPosts(page, pageSize, title, published);
    const posts = await this.prisma.post.findMany({
      where: { tenantId: tenantId, ...where },
      skip,
      take: Number(pageSize),
    });
    console.log(posts);

    return posts;
  }

  findDrafts(
    userId: number,
    {
      page,
      pageSize,
      title,
      published = 'false',
    }: { page: string; pageSize: string; title?: string; published?: string },
  ) {
    const { skip, where } = this.filterPosts(page, pageSize, title, published);
    return this.prisma.post.findMany({ where, skip, take: Number(pageSize) });
  }

  findPublished(
    userId: number,
    {
      page,
      pageSize,
      title,
      published = 'true',
    }: { page: string; pageSize: string; title?: string; published?: string },
  ) {
    const { skip, where } = this.filterPosts(page, pageSize, title, published);
    return this.prisma.post.findMany({ where, skip, take: Number(pageSize) });
  }

  findOne(tenantId: number, id: number) {
    return this.prisma.post.findUnique({
      where: { tenantId: tenantId, id },
      include: { author: true },
    });
  }

  async update(
    tenantId: number,
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
    userRole: Role,
  ) {
    await this.userHasPermission(id, userId, userRole);
    return this.prisma.post.update({
      where: { tenantId: tenantId, id },
      data: updatePostDto,
    });
  }

  async remove(tenantId: number, id: number, userId: number, userRole: Role) {
    await this.userHasPermission(id, userId, userRole);
    return this.prisma.post.delete({ where: { tenantId: tenantId, id } });
  }
}
