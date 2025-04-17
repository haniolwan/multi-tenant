import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { TenantModule } from './tenant/tenant.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TenantMiddleware } from 'prisma/middleware/tenant-middleware';

@Module({
  imports: [
    // Create multible throttle defs
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    TenantModule,
    PrismaModule,
    AuthModule,
    PostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // global for all classes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: 'tenant/*', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
