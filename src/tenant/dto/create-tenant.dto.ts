import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  slug: string;

  //   @IsInt()
  //   @IsNotEmpty()
  //   @ApiProperty()
  //   owner_id: number;

  @IsOptional()
  @IsInt({ each: true })
  @ApiProperty({ required: false, type: [Number] })
  user_ids: number[] | null;
}
