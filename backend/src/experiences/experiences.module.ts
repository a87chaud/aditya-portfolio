import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service.js';
import { ExperiencesController } from './experiences.controller.js';

@Module({
  providers: [ExperiencesService],
  controllers: [ExperiencesController]
})
export class ExperiencesModule {}
