import { Component, inject, OnInit, Signal } from '@angular/core';
import { Experience, ExperienceService } from '../services/experience.service';
import { Project, ProjectsService } from '../services/projects.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private experienceService = inject(ExperienceService);
  private projectService = inject(ProjectsService);

  // use signals to set these
  experiences: Signal<Experience[]> = this.experienceService.experiences;
  projects: Signal<Project[]> = this.projectService.projects;
  loading = true;

  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.experienceService.getAll();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
