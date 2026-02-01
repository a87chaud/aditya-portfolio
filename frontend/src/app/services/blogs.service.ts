import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private BASE_URL = 'http://localhost:3000/blog';

  constructor(private http: HttpClient) {}

  private readonly posts$ = new BehaviorSubject<BlogPost[]>([]);
  readonly posts = toSignal(this.posts$, { initialValue: [] });

  getAll() {
    this.http.get<BlogPost[]>(this.BASE_URL).subscribe((posts) => this.posts$.next(posts));
  }

  getById(id: string) {
    this.http.get<BlogPost>(`${this.BASE_URL}/${id}`).subscribe((post) => this.posts$.next([post]));
  }

  create(data: Partial<BlogPost>) {
    this.http
      .post<BlogPost>(this.BASE_URL, data)
      .subscribe((post) => this.posts$.next([...this.posts$.value, post]));
  }

  update(id: string, data: Partial<BlogPost>) {
    this.http.put<BlogPost>(`${this.BASE_URL}/${id}`, data).subscribe(() =>
      this.posts$.next(
        this.posts$.value.map((currPost) => {
          if (currPost.id === id) {
            return {
              ...currPost,
              ...data,
            };
          }
          return currPost;
        }),
      ),
    );
  }

  delete(id: string) {
    this.http
      .delete(`${this.BASE_URL}/${id}`)
      .subscribe(() => this.posts$.next(this.posts$.value.filter((post) => post.id !== id)));
  }
}
