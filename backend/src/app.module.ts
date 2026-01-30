import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ExperiencesModule } from './experiences/experiences.module.js';
import { ExperiencesService } from './experiences/experiences.service.js';
import { ExperiencesController } from './experiences/experiences.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
     AuthModule,
     ExperiencesModule],
  controllers: [AppController, ExperiencesController],
  providers: [AppService, ExperiencesService],
})
export class AppModule {}
