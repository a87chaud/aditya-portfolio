import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private BASE_URL = 'http://localhost:3000/projects'

  constructor(private http: HttpClient){}

  getAll(): Observable<Project[]> {  
    return this.http.get<Project[]>(this.BASE_URL);
  }
}
