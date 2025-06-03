import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './auth/auth.guard';
import { PlatformPageComponent } from './platform-page/platform-page.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user-profile/user-profile.component').then((m) => m.UserProfileComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin/videogame',
    canActivate:[adminGuard],
    loadComponent: () =>
      import('./videogame-add/videogame-add.component').then((m) => m.VideogameAddComponent),
  },
  {
    path: 'PC',
    component: PlatformPageComponent,
  },
  {
    path: 'PlayStation',
    component: PlatformPageComponent,
  },
  {
    path: 'Xbox',
    component: PlatformPageComponent,
  },
  {
    path: 'Nintendo',
    component: PlatformPageComponent,
  },
  {
    path: 'videogame/:id',
    loadComponent: () =>
      import('./videogame-detail/videogame-detail.component').then((m) => m.VideogameDetailComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
  path: 'trendings',
  loadComponent: () =>
    import('./trendings/trendings.component').then(m => m.TrendingsComponent),
},

];
