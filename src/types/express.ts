import { Role } from '@prisma/client';
import { Request } from 'express';

export interface AuthRequest extends Request {
  tenantId?: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
    tenantId: number;
  };
}
