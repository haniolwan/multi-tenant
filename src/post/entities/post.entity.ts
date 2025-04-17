import { Post } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class PostEntity implements Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  author_id: number;

  @ApiProperty()
  tenantId: number;

  @ApiProperty()
  published_at: Date;

  @ApiProperty()
  created_at: Date | null;

  @ApiProperty()
  updated_at: Date | null;

  @ApiProperty({ required: false, type: UserEntity })
  author?: UserEntity;

  constructor({ author, ...data }: Partial<PostEntity>) {
    Object.assign(this, data);
    if (author) {
      this.author = new UserEntity(author);
    }
  }
}
