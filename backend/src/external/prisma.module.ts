import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../external/prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}