import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtDto, LoginDto, Role } from './dtos/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../external/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService
    ){}

    async login(loginDto: LoginDto){
        const email: string = loginDto.email;
        const enteredPassword: string = loginDto.password;
        const user = await this.prismaService.user.findUnique({where: {email}});
        if (!user) throw new UnauthorizedException('Email not found');
        const passwordMatch = await bcrypt.compare (enteredPassword, user.password);
        if (!passwordMatch) throw new UnauthorizedException('Incorrect password');
        const payload: JwtDto = {email: user.email, sub: user.id, role: user.role as Role};
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
