import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ExperiencesService } from './experiences.service.js';
import type { ExperienceDto } from './dtos/experiences.dtos.js';
import { JwtAuthGuard } from '../external/jwt-auth-guard.js';

@Controller('experiences')
export class ExperiencesController {
    constructor(private experiencesService: ExperiencesService){}
    @Get()
    getAllExperiences(): Promise<ExperienceDto[]> {
        return this.experiencesService.getAllExperiences()
    }

    @Get(':id')
    getExperienceById(@Param('id') id: string): Promise<ExperienceDto> {
        return this.experiencesService.getExperienceById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    addExperience(@Body() newExperience: Omit<ExperienceDto, 'id'>): Promise<ExperienceDto> {
        return this.experiencesService.addExperience(newExperience);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    editExperience(@Param() id: string, @Body() newExperience: ExperienceDto) {
        return this.experiencesService.editExperience(id, newExperience);
    }
}
