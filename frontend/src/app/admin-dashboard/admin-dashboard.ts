import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Experience, ExperienceService } from '../services/experience.service';
import { Project, ProjectsService } from '../services/projects.service';
import { BlogPost, BlogService } from '../services/blogs.service';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

type ViewMode = 'dashboard' | 'experience' | 'projects' | 'blog';
type FormMode = 'add' | 'edit';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
// dashboard to manage my experiences + projects and the daily blog
export class AdminDashboard implements OnInit {
  private experienceService = inject(ExperienceService);
  private projectService = inject(ProjectsService);
  private blogService = inject(BlogService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  currentView: ViewMode = 'dashboard';

  // need to make an observable in each of those classes
  // then subscribe to that
  // that shared observable will hold the state modified by any crud ops
  experiences: Signal<Experience[]> = this.experienceService.experiences;
  blogPosts: Signal<BlogPost[]> = this.blogService.posts;
  projects: Signal<Project[]> = this.projectService.projects;

  ngOnInit(): void {
    this.projectService.getAll();
    this.experienceService.getAll();
    this.blogService.getAll();
  }
  // projects = toSignal(
  //     this.projectService.getAll(),
  //     {initialValue: []}
  //   );

  //   blogPosts = toSignal(
  //     this.blogService.getAll(),
  //     {initialValue: []}
  //   )

  experienceForm: Partial<Experience> = this.getEmptyExperience();
  projectForm: Partial<Project> = this.getEmptyProject();
  blogForm: Partial<BlogPost> = this.getEmptyBlogPost();

  showExperienceForm = false;
  showProjectForm = false;
  showBlogForm = false;
  formMode: FormMode = 'add';
  editingId: string | null = null;

  getEmptyExperience(): Partial<Experience> {
    return {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: [],
      current: false,
      order: 0,
    };
  }

  getEmptyProject(): Partial<Project> {
    return {
      title: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
      featured: false,
      order: 0,
    };
  }

  getEmptyBlogPost(): Partial<BlogPost> {
    return {
      title: '',
      content: '',
      summary: '',
      tags: [],
      published: true,
    };
  }

  setView(view: ViewMode): void {
    this.currentView = view;
    this.closeAllForms();
  }

  openExperienceForm(mode: FormMode = 'add', experience?: Experience): void {
    this.formMode = mode;
    if (mode === 'edit' && experience) {
      this.experienceForm = { ...experience };
      this.editingId = experience.id!;
    } else {
      this.experienceForm = this.getEmptyExperience();
      this.editingId = null;
    }
    this.showExperienceForm = true;
  }

  saveExperience(): void {
    const data = this.experienceForm as Omit<Experience, 'id'>;

    if (this.formMode === 'add') {
      this.experienceService.create(data);
    } else if (this.editingId) {
      this.experienceService.update(this.editingId, data);
      this.closeExperienceForm();
    }
  }

  deleteExperience(id: string): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.experienceService.delete(id);
    }
  }
  closeExperienceForm(): void {
    this.showExperienceForm = false;
    this.experienceForm = this.getEmptyExperience();
  }

  // Project CRUD
  openProjectForm(mode: FormMode = 'add', project?: Project): void {
    this.formMode = mode;
    if (mode === 'edit' && project) {
      this.projectForm = { ...project };
      this.editingId = project.id!;
    } else {
      this.projectForm = this.getEmptyProject();
      this.editingId = null;
    }
    this.showProjectForm = true;
  }

  saveProject(): void {
    const data = this.projectForm as Omit<Project, 'id' | 'createdAt'>;

    if (this.formMode === 'add') {
      this.projectService.create(data);
    } else if (this.editingId) {
      this.projectService.update(this.editingId, data);
    }
    this.closeProjectForm();
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.delete(id);
    }
  }

  closeProjectForm(): void {
    this.showProjectForm = false;
    this.projectForm = this.getEmptyProject();
  }

  // Blog CRUD
  openBlogForm(mode: FormMode = 'add', post?: BlogPost): void {
    this.formMode = mode;
    if (mode === 'edit' && post) {
      this.blogForm = { ...post };
      this.editingId = post.id!;
    } else {
      this.blogForm = this.getEmptyBlogPost();
      this.editingId = null;
    }
    this.showBlogForm = true;
  }

  saveBlogPost(): void {
    const data = this.blogForm as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

    if (this.formMode === 'add') {
      this.blogService.create(data);
    } else if (this.editingId) {
      this.blogService.update(this.editingId, data);
    }
    this.closeBlogForm();
  }

  deleteBlogPost(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.delete(id);
    }
  }

  closeBlogForm(): void {
    this.showBlogForm = false;
    this.blogForm = this.getEmptyBlogPost();
  }

  // Helper Methods
  closeAllForms(): void {
    this.showExperienceForm = false;
    this.showProjectForm = false;
    this.showBlogForm = false;
  }

  // Array helpers for forms
  addTechnology(type: 'experience' | 'project'): void {
    if (type === 'experience') {
      if (!this.experienceForm.technologies) this.experienceForm.technologies = [];
      this.experienceForm.technologies.push('');
    } else {
      if (!this.projectForm.technologies) this.projectForm.technologies = [];
      this.projectForm.technologies.push('');
    }
  }

  removeTechnology(type: 'experience' | 'project', index: number): void {
    if (type === 'experience' && this.experienceForm.technologies) {
      this.experienceForm.technologies.splice(index, 1);
    } else if (this.projectForm.technologies) {
      this.projectForm.technologies.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  addTag(): void {
    if (!this.blogForm.tags) this.blogForm.tags = [];
    this.blogForm.tags.push('');
  }

  removeTag(index: number): void {
    if (this.blogForm.tags) {
      this.blogForm.tags.splice(index, 1);
    }
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['']);
  }
}
