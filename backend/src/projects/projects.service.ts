import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectDto } from './dto/project.dto.js';
import { PrismaService } from '../external/prisma.service.js';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async getAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.prismaService.project.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return projects.map((project) => this.projectDtoMapper(project));
  }

  async getProjectById(id: string): Promise<ProjectDto> {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException();
    return this.projectDtoMapper(project);
  }

  async addProject(newProject: Omit<ProjectDto, 'id'>): Promise<ProjectDto> {
    const project = await this.prismaService.project.create({
      data: newProject,
    });
    if (!project) throw new BadRequestException();
    return this.projectDtoMapper(project);
  }

  async editProject(id: string, newProject: ProjectDto): Promise<ProjectDto> {
    const project = await this.prismaService.project.update({
      where: { id },
      data: {
        ...newProject,
        createdAt: new Date(),
      },
    });
    if (!project) throw new BadRequestException();
    return this.projectDtoMapper(project);
  }

  async deleteProject(id: string): Promise<ProjectDto> {
    const project = this.prismaService.project.delete({ where: { id } });
    if (!project) throw new NotFoundException();
    return this.projectDtoMapper(project);
  }
  private projectDtoMapper(project): ProjectDto {
    return {
      ...project,
      createdAt: project.createdAt
        ? project.createdAt.toISOString()
        : undefined,
    };
  }
}
