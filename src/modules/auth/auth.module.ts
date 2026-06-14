import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    PrismaModule, // Assuming you have a PrismaModule for database interactions
    JwtModule.register({
      secret: 'pravendra123', // Replace with your own secret key
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }), 
  ],

})
export class AuthModule {}
