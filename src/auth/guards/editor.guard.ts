// user.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { AuthRequest } from 'src/types/express';

@Injectable()
export class EditorGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async CanActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest<AuthRequest>().user;

    // Ensure the user has the 'EDITOR' role
    if (user.role !== 'EDITOR') {
      throw new ForbiddenException(
        'Access denied. Only editors can perform this action',
      );
    }
    return super.canActivate(context); // Check JWT validity
  }
}
