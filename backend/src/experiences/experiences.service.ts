import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExperienceDto } from './dtos/experiences.dtos.js';
import { PrismaService } from '../external/prisma.service.js';

@Injectable()
export class ExperiencesService {
  constructor(private prismaService: PrismaService) {}

  async getAllExperiences(): Promise<ExperienceDto[]> {
    const experiences = await this.prismaService.experience.findMany({
      orderBy: { order: 'asc' },
    });
    return experiences.map((exp) => this.experienceDtoMapper(exp));
  }

  async getExperienceById(id: string): Promise<ExperienceDto> {
    const experience = await this.prismaService.experience.findUnique({
      where: { id },
    });
    if (!experience) throw new NotFoundException();
    return this.experienceDtoMapper(experience);
  }

  async addExperience(newExperience: ExperienceDto): Promise<ExperienceDto> {
    const experience = await this.prismaService.experience.create({
      data: {
        ...newExperience,
        startDate: this.parseMonthYear(newExperience.startDate),
        endDate: newExperience.endDate
          ? this.parseMonthYear(newExperience.endDate)
          : null,
      },
    });

    if (!experience) throw new BadRequestException();
    return this.experienceDtoMapper(experience);
  }

  async editExperience(
    id: string,
    newExperience: ExperienceDto,
  ): Promise<ExperienceDto> {
    const experience = await this.prismaService.experience.update({
      where: { id },
      data: {
        ...newExperience,
        startDate: newExperience.startDate
          ? this.parseMonthYear(newExperience.startDate)
          : undefined,
        endDate: newExperience.endDate
          ? this.parseMonthYear(newExperience.endDate)
          : undefined,
      },
    });

    if (!experience) throw new BadRequestException();
    return this.experienceDtoMapper(experience);
  }

  async deleteExperience(id: string): Promise<ExperienceDto> {
    const experience = await this.prismaService.experience.delete({
      where: { id },
    });
    if (!experience) throw new NotFoundException();
    return this.experienceDtoMapper(experience);
  }

  // =====================
  // Helpers
  // =====================

  /**
   * Converts "YYYY-MM" → Date (YYYY-MM-01T00:00:00Z)
   */
  private parseMonthYear(value: string): Date {
    const [year, month] = value.split('-').map(Number);

    if (!year || !month || month < 1 || month > 12) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM.');
    }

    return new Date(Date.UTC(year, month - 1, 1));
  }

  /**
   * Converts Date → "YYYY-MM"
   */
  private experienceDtoMapper(experience): ExperienceDto {
    return {
      ...experience,
      startDate: this.formatMonthYear(experience.startDate),
      endDate: experience.endDate
        ? this.formatMonthYear(experience.endDate)
        : undefined,
    };
  }

  private formatMonthYear(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
