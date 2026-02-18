import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { LandingComponent } from './landing-component/landing/landing.component';

export const routes: Routes = [
  // PUBLIC: Landing
  {
    path: '',
    loadComponent: () =>
      import('./landing-component/landing/landing.component')
        .then(m => m.LandingComponent),
  },

  // PROTECTED: With sidebar + header
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/layout.component')
        .then(m => m.LayoutComponent),
    children: [
      {
        path: 'attendance',
        loadChildren: () =>
          import('./attendance/attendance.routes').then(m => m.ATTENDANCE_ROUTES),
      },
      {
        path: 'grades',
        loadChildren: () =>
          import('./grades/grades.routes').then(m => m.GRADES_ROUTES),
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },

  // Optional: 404 fallback
  { path: '**', redirectTo: '' },
];

