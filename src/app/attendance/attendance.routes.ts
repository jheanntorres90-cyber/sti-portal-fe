import { Routes } from '@angular/router';

export const ATTENDANCE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.AttendanceDashboardComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./attendance/attendance.component').then(m => m.TeacherAttendanceComponent)
  },
  {
    path: 'student-list',
    loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent)
  },
  {
    path: 'schedule',
    loadComponent: () => import('./schedule/schedule.component').then(m => m.TeacherScheduleComponent) 
  },
  {
    path: 'announcements',
    // UPDATED THIS LINE to match the class name below
    loadComponent: () => import('./announcements/announcements.component').then(m => m.TeacherAnnouncementsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.AttendanceSettingsComponent)
  },
  {
    path: 'student-dashboard',
    loadComponent: () => import('./student/dashboard/dashboard.component').then(m => m.StudentAttendanceDashboardComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];