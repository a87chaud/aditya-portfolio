import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import ('./home/home.component').then(i => i.HomeComponent)
    }, 
    {
        path: "auth/login",
        loadComponent: () => import ('./admin-login/admin-login').then(i => i.AdminLogin)
    }, 
];
