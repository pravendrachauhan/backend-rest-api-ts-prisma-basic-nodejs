import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

@Module({
  providers: [AuthService, JwtStrategy, TokenService],
  controllers: [AuthController],
  imports: [
    PrismaModule, // you have a PrismaModule for database interactions
    // JwtModule.register({
    //   secret: 'pravendra123', // Replace with your own secret key
    //   signOptions: { expiresIn: '1d' }, // Token expiration time
    // }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        const expiresIn = configService.get<string>('jwt.expiresIn') ?? '1d';

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
    }),
  ],

})
export class AuthModule {}
