import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blog',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blog/:id',
    renderMode: RenderMode.Server, // 👈 Use server-side rendering instead of prerendering
  },
  {
    path: 'admin/login',
    renderMode: RenderMode.Client, // 👈 Admin pages should be client-side only
  },
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
