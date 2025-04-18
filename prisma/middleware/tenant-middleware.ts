import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || '';

interface CustomJwtPayload extends jwt.JwtPayload {
  tenantId: string;
  userId: number;
  role: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let tenantId: string | undefined;

    if (req.headers['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'] as string;
    } else if (req.headers.host) {
      const host = req.headers.host; // e.g., tenant1.localhost:3000
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'localhost') {
        tenantId = subdomain;
      }
    }

    // If still no tenantId, try JWT token
    if (!tenantId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload;
          tenantId = decoded.tenantId;
        } catch (err) {
          console.error(err);
          throw new UnauthorizedException('Invalid token');
        }
      }
    }

    // if no tenantId resolved, throw error
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID could not be resolved');
    }

    req['tenantId'] = tenantId;
    next();
  }
}
