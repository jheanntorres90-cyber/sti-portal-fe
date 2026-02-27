import { Routes } from '@angular/router';

export const GRADES_ROUTES: Routes = [
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
    path: 'admin-schedule',
    loadComponent: () =>
      import('./admin/schedule-management/schedule.component').then(
        (m) => m.AdminScheduleComponent,
      ),
  },
  {
    path: 'admin-records-management',
    loadComponent: () =>
      import('./admin/records-management/records-management.component').then(
        (m) => m.RecordManageStudentsComponent,
      ),
  },
  {
    path: 'admin-data-management',
    loadComponent: () =>
      import('./admin/data-management/data-management.component').then(
        (m) => m.AdminDataManagementComponent,
      ),
  },
  {
    path: 'admin-grades-management',
    loadComponent: () =>
      import('./admin/grades-management/grades-management').then(
        (m) => m.AdminGradesManagement,
      ),
  },
  //============================================
  // PROFESSOR ROUTES
  //============================================
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./prof/dashboard/dashboard.component').then(
        (m) => m.GradesDashboardComponent,
      ),
  },
  {
    path: 'my-schedule',
    loadComponent: () =>
      import('./prof/my-schedule/my-schedule.component').then(
        (m) => m.MyScheduleComponent,
      ),
  },
  {
    path: 'my-students',
    loadComponent: () =>
      import('./prof/my-students/my-students.component').then(
        (m) => m.MyStudentsComponent,
      ),
  },
  {
    // Ensure the folder is named 'upload-grades' and file is 'upload-grades.component.ts'
    path: 'upload-grades',
    loadComponent: () =>
      import('./prof/upload-grades/upload-grades.component').then(
        (m) => m.UploadGradesComponent,
      ),
  },
  {
    path: 'view-grades',
    loadComponent: () =>
      import('./prof/view-grades/view-grades.component').then(
        (m) => m.ViewGradesComponent,
      ),
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./prof/announcements/announcements.component').then(
        (m) => m.TeacherAnnouncementsComponent,
      ),
  },
  //============================================
  // STUDENT ROUTES
  //============================================
  {
    path: 'student-dashboard',
    loadComponent: () =>
      import('./student/dashboard.component').then(
        (m) => m.StudentDashboardComponent,
      ),
  },
  {
    path: 'student-grades',
    loadComponent: () =>
      import('./student/grades/grades.component').then(
        (m) => m.GradesComponent,
      ),
  },
  //============================================
  // PARENT ROUTES
  //============================================
  {
    path: 'parent-dashboard',
    loadComponent: () =>
      import('./parent/dashboard/dashboard.component').then(
        (m) => m.ParentDashboardComponent,
      ),
  },
  {
    path: 'parent-child-grades',
    loadComponent: () =>
      import('./parent/child-grades/child-grades.component').then(
        (m) => m.ChildGradesComponent,
      ),
  },
  {
    path: 'parent-child-schedule',
    loadComponent: () =>
      import('./parent/child-schedule/child-schedule.component').then(
        (m) => m.ChildScheduleComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
