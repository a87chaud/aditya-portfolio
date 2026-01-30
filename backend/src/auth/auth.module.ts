import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './external/prisma.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from './external/jwt.service.js';

@Module({
  imports: [
    // Ensure ConfigModule is here to load the .env file
    ConfigModule.forRoot({ isGlobal: true }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthService, PrismaService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
