import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceDto } from './dtos/experiences.dtos.js';
import { PrismaService } from '../external/prisma.service.js';

@Injectable()
export class ExperiencesService {
    constructor(private prismaService: PrismaService){}
    async getAllExperiences(): Promise<ExperienceDto[]> {
        const experiences = await this.prismaService.experience.findMany({
            orderBy: { order: 'asc' },
        });
        return experiences.map(exp => this.experienceDtoMapper(exp));
    }

    async getExperienceById(id): Promise<ExperienceDto> {
        const experience = await this.prismaService.experience.findUnique({where: {id}});
        if (!experience) throw new NotFoundException;
        return this.experienceDtoMapper(experience);
    }
    
    async addExperience(newExperience: ExperienceDto): Promise<ExperienceDto> {
        const experience = await this.prismaService.experience.create({data: newExperience});
        if (!experience) throw new BadRequestException;
        return this.experienceDtoMapper(experience);
    }

    async editExperience(id: string, newExperience: ExperienceDto): Promise<ExperienceDto> {
        const experience = await this.prismaService.experience.update({
            where: { id },
            data: {
                ...newExperience,
                startDate: newExperience.startDate ? new Date(newExperience.startDate) : undefined,
                endDate: newExperience.endDate ? new Date(newExperience.endDate) : undefined,
            }
        });
        if (!experience) throw new BadRequestException;
        return this.experienceDtoMapper(experience);
    }

    async deleteExperience(id: string): Promise<ExperienceDto> {
        const experience = await this.prismaService.experience.delete({where: {id}});
        if (!experience) throw new NotFoundException;
        return this.experienceDtoMapper(experience);
    }

    private experienceDtoMapper(experience): ExperienceDto {
        return {
            ...experience,
            startDate: experience.startDate.toISOString(),
            endDate: experience.endDate? experience.endDate.toISOString() : undefined
        }
    }
}
