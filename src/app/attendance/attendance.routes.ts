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
    path: 'gate-attendance',
    loadComponent: () => import('./student/gate-attendance/gate-attendance.component').then(m => m.GateAttendanceComponent)
  },
  {
    path: 'subject-attendance',
    loadComponent: () => import('./student/subject-attendance/subject-attendance.component').then(m => m.SubjectAttendanceComponent)
  },
  {
    path: 'student-schedule',
    loadComponent: () => import('./student/schedule/schedule.component').then(m => m.StudentScheduleComponent)  
  },
  {
    path: 'student-announcements',
    loadComponent: () => import('./student/announcements/announcements.component').then(m => m.StudentAnnouncementsComponent)
  },
  {
   path: 'admin-dashboard',
   loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin-attendance',
    loadComponent: () => import('./admin/dashboard/attendance/attendance.component').then(m => m.AdminAttendanceComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];