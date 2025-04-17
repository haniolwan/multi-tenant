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
    console.log('TenantMiddleware running for route:', req.originalUrl);

    const host = req.headers.host; // e.g., tenant1.localhost:3000
    const subdomain = host?.split('.')[0];
    let tenantId: string | undefined = req.params.tenantId;

    if (subdomain && subdomain !== 'localhost') {
      tenantId = subdomain;
    } else {
      // If no subdomain, fallback to JWT
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload;
          tenantId = decoded.tenantId;
        } catch (err) {
          console.log(err);
          throw new UnauthorizedException('Invalid token');
        }
      }
    }

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID could not be resolved');
    }

    req['tenantId'] = tenantId;
    next();
  }
}
