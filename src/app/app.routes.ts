import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/attendance/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'attendance',
    canActivate: [authGuard],
    loadChildren: () => import('./attendance/attendance.routes').then(m => m.ATTENDANCE_ROUTES)
  },
  { 
    path: 'grades',
    canActivate: [authGuard],
    loadChildren: () => import('./grades/grades.routes').then(m => m.GRADES_ROUTES)
  },
  // --- NEW ROUTES START ---
  { 
    path: 'profile', 
    canActivate: [authGuard],
    component: ProfileComponent 
  },
  { 
    path: 'notifications', 
    canActivate: [authGuard],
    component: NotificationsComponent 
  },
  { 
    path: 'settings', 
    canActivate: [authGuard],
    component: SettingsComponent 
  },
  // --- NEW ROUTES END ---
  { 
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { 
    path: '**', 
    redirectTo: '/attendance/dashboard' 
  }
];