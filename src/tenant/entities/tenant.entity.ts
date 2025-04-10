import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '@prisma/client';

export class TenantEntity implements Tenant {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  created_at: Date | null;

  @ApiProperty()
  updated_at: Date | null;
}
