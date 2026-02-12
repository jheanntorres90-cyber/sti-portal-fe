import { Routes } from '@angular/router';

export const GRADES_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.GradesDashboardComponent)
  },
  {
    path: 'my-schedule',
    loadComponent: () => import('./my-schedule/my-schedule.component').then(m => m.MyScheduleComponent)
  },
  {
    path: 'my-students',
    loadComponent: () => import('./my-students/my-students.component').then(m => m.MyStudentsComponent)
  },
  {
    // Ensure the folder is named 'upload-grades' and file is 'upload-grades.component.ts'
    path: 'upload-grades',
    loadComponent: () => import('./upload-grades/upload-grades.component').then(m => m.UploadGradesComponent)
  },
  {
    path: 'view-grades',
    loadComponent: () => import('./view-grades/view-grades.component').then(m => m.ViewGradesComponent)
  },
  {
    path: 'announcements',
    loadComponent: () => import('./announcements/announcements.component').then(m => m.TeacherAnnouncementsComponent)
  },
  {
    path: 'student-dashboard',
    loadComponent: () => import('./student/dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'student-grades',
    loadComponent: () => import('./student/grades/grades.component').then(m => m.GradesComponent)  
  },
  {
    path: 'student-schedule ',
    loadComponent: () => import('./student/schedule/schedule.component').then(m => m.MyScheduleComponent)
  },
  {
    path: 'student-announcements',
loadComponent: () => import('./student/announcements/announcements.component').then(m => m.AnnouncementsComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];