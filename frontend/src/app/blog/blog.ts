import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../services/blogs.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  private blogService = inject(BlogService);
  // TODO: Some may be drafts which will stil show up
  posts = this.blogService.posts;
  loading = false;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.loading = true;
    this.blogService.getAll();
    this.loading = false;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
