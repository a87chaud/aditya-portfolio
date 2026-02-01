import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

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

// I realised after I should have made an abstract class but lazy
export class ExperienceService {
  private BASE_URL = 'http://localhost:3000/experiences';
  constructor(private http: HttpClient) {}
  private readonly experiences$ = new BehaviorSubject<Experience[]>([]);
  readonly experiences = toSignal(this.experiences$, { initialValue: [] });

  getAll() {
    this.http.get<Experience[]>(this.BASE_URL).subscribe((exp) => this.experiences$.next(exp));
  }

  create(data: Partial<Experience>) {
    this.http
      .post<Experience>(this.BASE_URL, data)
      .subscribe((exp) => this.experiences$.next([...this.experiences$.value, exp]));
  }

  update(id: string, data: Partial<Experience>) {
    this.http.put<Experience>(`${this.BASE_URL}/${id}`, data).subscribe((updatedExp) =>
      this.experiences$.next(
        this.experiences$.value.map((currExp) => {
          if (currExp.id == id) {
            return {
              ...currExp,
              ...data,
            };
          }
          return currExp;
        }),
      ),
    );
  }

  delete(id: string) {
    this.http
      .delete<Experience>(`${this.BASE_URL}/${id}`)
      .subscribe((updatedExp) =>
        this.experiences$.next(this.experiences$.value.filter((exp) => exp.id != id)),
      );
  }
}
