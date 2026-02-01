import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import type { ProjectDto } from './dto/project.dto.js';
import { JwtAuthGuard } from '../external/jwt-auth-guard.js';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get()
  getAllProjects(): Promise<ProjectDto[]> {
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  getProjectById(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectService.getProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addProject(@Body() newProject: Omit<ProjectDto, 'id'>) {
    return this.projectService.addProject(newProject);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  editProject(
    @Param('id') id: string,
    updatedProject: ProjectDto,
  ): Promise<ProjectDto> {
    return this.projectService.editProject(id, updatedProject);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProject(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectService.deleteProject(id);
  }
}
