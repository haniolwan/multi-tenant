import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export const ApiAuthWithTenant = () => {
  return applyDecorators(ApiSecurity('JWT-auth'), ApiSecurity('tenant-id'));
};
