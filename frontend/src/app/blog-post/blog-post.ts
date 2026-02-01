import { Component, inject, signal, Signal } from '@angular/core';
import { BlogPost, BlogService } from '../services/blogs.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPostComponent {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  loading = signal(false);
  currentYear = new Date().getFullYear();

  // gonna be a list with a single element
  posts: Signal<BlogPost[]> = this.blogService.posts;
  post = signal(this.posts()[0]);

  ngOnInit() {
    this.loading.set(true);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getById(id);
    }
    this.loading.set(false);
  }

  // copied func - refactor :(
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
