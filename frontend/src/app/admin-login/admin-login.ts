import { Component, inject } from '@angular/core';
import { AdminService, LoginDto } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private adminService = inject(AdminService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  loading = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Enter email and password';
    }
    this.loading = true;
    this.error = '';

    this.adminService
      .login({
        email: this.email,
        password: this.password,
      } as LoginDto)
      .subscribe({
        next: (_res) => {
          console.log('Reached');
          this.loading = false;
          console.log('Token in localStorage:', localStorage.getItem('token'));
          this.password = '';
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err;
          this.password = '';
          this.router.navigate(['']);
        },
      });
  }
}
