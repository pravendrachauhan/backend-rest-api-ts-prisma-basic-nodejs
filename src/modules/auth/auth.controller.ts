import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiBearerAuth('JWT') //it is used to specify that the endpoints in this controller require JWT authentication. It adds a security scheme to the Swagger documentation, 
// indicating that clients need to provide a valid JWT token in the Authorization header when making requests to these endpoints.  
//without this, the Swagger documentation will not Authentication in header and you will not be able to test the protected endpoints directly from the Swagger UI.
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() registerDto: RegisterDto){
        return await this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto){
        return {
            access_token: await this.authService.login(loginDto),
        };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard) // You would typically use an AuthGuard here to protect this route
        //async getProfile(@Request() req) {  //intead of using @Request() in production apps it is better to create a custom decorator like @CurrentUser() to extract the user information from the request object, which can help improve code readability and maintainability.
    async getProfile(@CurrentUser() req) {
        return req.user; // user is attached to the request by an authentication guard
    }
}
