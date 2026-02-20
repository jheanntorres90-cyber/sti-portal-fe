import { Routes } from '@angular/router';

export const ATTENDANCE_ROUTES: Routes = [
  //============================================
  // ADMIN ROUTES
  //============================================
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  {
    path: 'admin-attendance',
    loadComponent: () =>
      import('./admin/attendance/attendance.component').then(
        (m) => m.AdminAttendanceComponent,
      ),
  },
  {
    path: 'admin-manage-students',
    loadComponent: () =>
      import('./admin/manage-students/manage.component').then(
        (m) => m.ManageStudentsComponent,
      ),
  },
  {
    path: 'admin-schedule',
    loadComponent: () =>
      import('./admin/schedule/schedule.component').then(
        (m) => m.AdminScheduleComponent,
      ),
  },
  {
    path: 'admin-announcements',
    loadComponent: () =>
      import('./admin/announcements/announcements').then(
        (m) => m.AdminAnnouncementsComponent,
      ),
  },
  {
    path: 'admin-add-new-admin',
    loadComponent: () =>
      import('./admin/add-new-admin/add-admin.component').then(
        (m) => m.AdminAddAdminComponent,
      ),
  },
  {
    path: 'admin-reset-password',
    loadComponent: () =>
      import('./admin/reset-password/reset-password.component').then(
        (m) => m.AdminResetPasswordComponent,
      ),
  },
  //============================================
  // PROFESSOR ROUTES
  //============================================
  {
    path: 'teacher-dashboard',
    loadComponent: () =>
      import('./prof/dashboard/dashboard.component').then(
        (m) => m.AttendanceDashboardComponent,
      ),
  },
  {
    path: 'attendance',
    loadComponent: () =>
      import('./prof/attendance/attendance.component').then(
        (m) => m.TeacherAttendanceComponent,
      ),
  },
  {
    path: 'student-list',
    loadComponent: () =>
      import('./prof/student-list/student-list.component').then(
        (m) => m.StudentListComponent,
      ),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./prof/schedule/schedule.component').then(
        (m) => m.TeacherScheduleComponent,
      ),
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./prof/announcements/announcements.component').then(
        (m) => m.TeacherAnnouncementsComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./prof/settings/settings.component').then(
        (m) => m.AttendanceSettingsComponent,
      ),
  },
  //============================================
  // STUDENT ROUTES
  //============================================
  {
    path: 'student-dashboard',
    loadComponent: () =>
      import('./student/dashboard/dashboard.component').then(
        (m) => m.StudentAttendanceDashboardComponent,
      ),
  },
  {
    path: 'gate-attendance',
    loadComponent: () =>
      import('./student/gate-attendance/gate-attendance.component').then(
        (m) => m.GateAttendanceComponent,
      ),
  },
  {
    path: 'subject-attendance',
    loadComponent: () =>
      import('./student/subject-attendance/subject-attendance.component').then(
        (m) => m.SubjectAttendanceComponent,
      ),
  },
  {
    path: 'student-schedule',
    loadComponent: () =>
      import('./student/schedule/schedule.component').then(
        (m) => m.StudentScheduleComponent,
      ),
  },
  {
    path: 'student-announcements',
    loadComponent: () =>
      import('./student/announcements/announcements.component').then(
        (m) => m.StudentAnnouncementsComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
