import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import configuration from './config/configuration';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';


@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema, load: [ configuration ]})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(
    consumer: MiddlewareConsumer,
  ) {

    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
