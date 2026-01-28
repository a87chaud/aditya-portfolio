import { Component, inject, OnInit} from '@angular/core';
import { Experience, ExperienceService } from '../services/experience.service';
import { ProjectsService } from '../services/projects.service';
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
export class HomeComponent {
  private experienceService = inject(ExperienceService)
  private projectService = inject(ProjectsService);

  // use signals to set these 
  experiences = toSignal(
  this.experienceService.getAll(),
  { initialValue: [] as Experience[] }
);

  projects = toSignal(
    this.projectService.getAll(),
    {initialValue: []}
  )
  loading = true;

  currentYear = new Date().getFullYear();
  
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}

