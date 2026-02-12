import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule],
  template: `
    <div class="h-screen sticky top-0 bg-white dark:bg-[#1e1e1e] border-r border-gray-100 dark:border-white/5 w-72 flex flex-col justify-between shadow-sm overflow-hidden transition-colors duration-300">
      
      <div class="flex flex-col flex-1 overflow-hidden">
        <div class="py-10 px-8 flex-shrink-0">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-[#2a2a2a] p-1 shadow-sm border border-transparent dark:border-white/5">
              <img src="assets/images/sti-logo.png" alt="STI Logo" class="w-full h-full object-contain">
            </div>
            <div>
              <h1 class="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">STI Portal</h1>
              <p class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-1">Faculty</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6">
          
          <div class="mb-4">
            <button (click)="isAttendanceOpen = !isAttendanceOpen" class="category-header group text-slate-500 dark:text-slate-400">
              <i class="pi pi-calendar-plus mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="tracking-[0.15em]">Attendance Portal</span>
              <i class="pi pi-chevron-down ml-auto text-[10px] transition-transform duration-300" 
                 [ngClass]="{'rotate-180': isAttendanceOpen}"></i>
            </button>
            
            <div *ngIf="isAttendanceOpen" class="mt-1 space-y-1 pl-4 border-l-2 border-gray-50 dark:border-white/5 ml-6">
              <a routerLink="/attendance/dashboard" routerLinkActive="active-attendance" class="nav-item">Dashboard</a>
              <a routerLink="/attendance/attendance" routerLinkActive="active-attendance" class="nav-item">Attendance</a>
              <a routerLink="/attendance/student-list" routerLinkActive="active-attendance" class="nav-item">Student List</a>
              <a routerLink="/attendance/schedule" routerLinkActive="active-attendance" class="nav-item">Schedule</a>
              <a routerLink="/attendance/announcements" routerLinkActive="active-attendance" class="nav-item">Announcements</a>
            </div>
          </div>

          <div class="mb-4">
            <button (click)="isGradesOpen = !isGradesOpen" class="category-header group text-slate-500 dark:text-slate-400">
              <i class="pi pi-chart-bar mr-3 group-hover:text-green-600 transition-colors"></i>
              <span class="tracking-[0.15em]">Grade Portal</span>
              <i class="pi pi-chevron-down ml-auto text-[10px] transition-transform duration-300" 
                 [ngClass]="{'rotate-180': isGradesOpen}"></i>
            </button>
            
            <div *ngIf="isGradesOpen" class="mt-1 space-y-1 pl-4 border-l-2 border-gray-50 dark:border-white/5 ml-6">
              <a routerLink="/grades/dashboard" routerLinkActive="active-grade" class="nav-item">Dashboard</a>
              <a routerLink="/grades/my-schedule" routerLinkActive="active-grade" class="nav-item">My Schedule</a>
              <a routerLink="/grades/my-students" routerLinkActive="active-grade" class="nav-item">My Students</a>
              <a routerLink="/grades/upload-grades" routerLinkActive="active-grade" class="nav-item">Upload Grades</a>
              <a routerLink="/grades/view-grades" routerLinkActive="active-grade" class="nav-item">View Grades</a>
              <a routerLink="/grades/announcements" routerLinkActive="active-grade" class="nav-item">Announcements</a>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-gray-100 dark:border-white/5">
            <h3 class="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account & System</h3>
            <div class="space-y-1">
              <a routerLink="/notifications" routerLinkActive="active-link" class="nav-item">
                <i class="pi pi-bell mr-3 text-[12px]"></i> Notifications
                <span class="ml-auto bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">3</span>
              </a>
              <a routerLink="/profile" routerLinkActive="active-link" class="nav-item">
                <i class="pi pi-user mr-3 text-[12px]"></i> My Profile
              </a>
              <a routerLink="/settings" routerLinkActive="active-link" class="nav-item">
                <i class="pi pi-cog mr-3 text-[12px]"></i> Settings
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div class="p-6 flex-shrink-0">
        <button (click)="logout()" 
                class="w-full group flex items-center justify-center space-x-3 py-4 bg-gray-900 dark:bg-[#2a2a2a] hover:bg-red-600 dark:hover:bg-red-600 text-white rounded-[1.25rem] transition-all duration-300 shadow-sm border border-transparent dark:border-white/5">
          <i class="pi pi-power-off text-xs group-hover:scale-110 transition-transform"></i>
          <span class="font-black text-[10px] uppercase tracking-[0.2em]">Logout System</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
      position: sticky; 
      top: 0;
      z-index: 50;
    }
    .category-header { 
      @apply w-full flex items-center px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-all rounded-xl; 
    }
    .nav-item { 
      @apply flex items-center px-4 py-2.5 text-[12px] font-bold text-gray-500 dark:text-slate-400 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-tight; 
    }
    .active-attendance { @apply bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-black; }
    .active-grade { @apply bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-black; }
    .active-link { @apply bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-black; }
    
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-gray-200 dark:bg-[#2a2a2a] rounded-full; }
  `]
})
export class SidebarComponent {
  isAttendanceOpen = true;
  isGradesOpen = false;

  logout() {
    console.log('Logging out...');
  }
}