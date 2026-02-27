import { Routes } from '@angular/router';
import { roleGuard } from '../core/guard/role.guard'; // ✅ adjust path if needed

export const ATTENDANCE_ROUTES: Routes = [
  //============================================
  // ADMIN ROUTES
  //============================================
  {
    path: 'admin-dashboard',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  {
    path: 'admin-attendance',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/attendance/attendance.component').then(
        (m) => m.AdminAttendanceComponent,
      ),
  },
  {
    path: 'admin-schedule',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/schedule/schedule.component').then(
        (m) => m.AdminScheduleComponent,
      ),
  },
  {
    path: 'admin-announcements',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/announcements/announcements').then(
        (m) => m.AdminAnnouncementsComponent,
      ),
  },
  {
    path: 'admin-administration',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/administration-panel/administration.component').then(
        (m) => m.AdministrationComponent,
      ),
  },
  {
    path: 'admin-reset-password',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./admin/reset-password/reset-password.component').then(
        (m) => m.AdminResetPasswordComponent,
      ),
  },

  //============================================
  // PROFESSOR / TEACHER ROUTES
  //============================================
  {
    path: 'teacher-dashboard',
    canActivate: [roleGuard],
    data: { roles: ['Professor'] },
    loadComponent: () =>
      import('./prof/dashboard/dashboard.component').then(
        (m) => m.AttendanceDashboardComponent,
      ),
  },
  {
    path: 'student-list',
    canActivate: [roleGuard],
    data: { roles: ['Professor'] },
    loadComponent: () =>
      import('./prof/student-list/student-list.component').then(
        (m) => m.StudentListComponent,
      ),
  },
  {
    path: 'schedule',
    canActivate: [roleGuard],
    data: { roles: ['Professor'] },
    loadComponent: () =>
      import('./prof/schedule/schedule.component').then(
        (m) => m.TeacherScheduleComponent,
      ),
  },
  //============================================
  // STUDENT ROUTES
  //============================================
  {
    path: 'student-dashboard',
    canActivate: [roleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./student/dashboard/dashboard.component').then(
        (m) => m.StudentAttendanceDashboardComponent,
      ),
  },
  {
    path: 'gate-attendance',
    canActivate: [roleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./student/gate-attendance/gate-attendance.component').then(
        (m) => m.GateAttendanceComponent,
      ),
  },
  {
    path: 'subject-attendance',
    canActivate: [roleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./student/subject-attendance/subject-attendance.component').then(
        (m) => m.SubjectAttendanceComponent,
      ),
  },
  {
    path: 'student-schedule',
    canActivate: [roleGuard],
    data: { roles: ['Student'] },
    loadComponent: () =>
      import('./student/schedule/schedule.component').then(
        (m) => m.StudentScheduleComponent,
      ),
  },


  //============================================
  // DEFAULT
  //============================================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'student-dashboard',
  },
];