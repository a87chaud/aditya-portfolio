import { Body, Controller, Post } from '@nestjs/common';
import type { LoginDto } from './dtos/login.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
