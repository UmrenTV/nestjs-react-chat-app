import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        console.log('login request recieved', dto.username);
        return this.authService.login(dto);
    }
}
