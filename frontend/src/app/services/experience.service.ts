import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  current: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private BASE_URL = 'http://localhost:3000/experience'

  constructor(private http: HttpClient){}

  getAll(): Observable<Experience[]> {  
    return this.http.get<Experience[]>(this.BASE_URL);
  }


}
