import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private tokenService: TokenService
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.prisma.user_Data.findUnique({
            where: {
                email: registerDto.email,
            },
        });

        if (!user) {
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            await this.prisma.user_Data.create({
                data: {
                    name: registerDto.name,
                    email: registerDto.email,
                    password: hashedPassword,
                }
            })
        }
        else {
            throw new UnauthorizedException('User already exists');
        }
        
    }

    async login(loginDto: LoginDto) {   
        const user = await this.prisma.user_Data.findUnique({
            where: {
                email: loginDto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.tokenService.generateTokens(payload);
    }

    async refreshToken(userId: number, email: string, role: string) {
        const payload = { sub: userId, email: email, role: role };
        return this.tokenService.generateTokens(payload);
    }

    async logout(userId: number) {
        this.prisma.user_Data.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }



}
