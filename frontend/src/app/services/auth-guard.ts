import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { AdminService } from './admin.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = adminService.getToken();

  if (!token) {
    router.navigate(['/admin/login']);
    return false;
  }

  if (adminService.isTokenExpired(token)) {
    adminService.logout();
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};
