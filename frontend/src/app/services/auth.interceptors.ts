import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AdminService} from "./admin.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const adminService = inject(AdminService);
    const token = adminService.getToken();
    
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
};
