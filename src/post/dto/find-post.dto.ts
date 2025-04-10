import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindPostsDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: '1',
  })
  @IsOptional()
  @IsString()
  page: string = '1';

  @ApiProperty({
    description: 'Number of posts per page for pagination',
    required: false,
    default: '10',
  })
  @IsOptional()
  @IsString()
  pageSize: string = '10';

  @ApiProperty({ description: 'Title filter', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Filter for published posts', required: false })
  @IsOptional()
  @IsString()
  published?: string;
}
