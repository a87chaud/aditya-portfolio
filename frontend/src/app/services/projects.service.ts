import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private BASE_URL = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  private readonly projects$ = new BehaviorSubject<Project[]>([]);
  readonly projects = toSignal(this.projects$, { initialValue: [] });

  getAll() {
    this.http.get<Project[]>(this.BASE_URL).subscribe((projects) => this.projects$.next(projects));
  }

  create(data: Partial<Project>) {
    this.http
      .post<Project>(this.BASE_URL, data)
      .subscribe((project) => this.projects$.next([...this.projects$.value, project]));
  }

  update(id: string, data: Partial<Project>) {
    this.http.put<Project>(`${this.BASE_URL}/${id}`, data).subscribe(() =>
      this.projects$.next(
        this.projects$.value.map((currProject) => {
          if (currProject.id === id) {
            return {
              ...currProject,
              ...data,
            };
          }
          return currProject;
        }),
      ),
    );
  }

  delete(id: string) {
    this.http
      .delete(`${this.BASE_URL}/${id}`)
      .subscribe(() =>
        this.projects$.next(this.projects$.value.filter((project) => project.id !== id)),
      );
  }
}
