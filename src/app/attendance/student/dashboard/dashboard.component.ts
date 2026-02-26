import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface TodayClass {
  subject: string;
  room: string;
  professor: string;
  time: string;
  status: 'present' | 'upcoming' | 'absent' | 'late';
}

// You can also remove the Announcement interface if it's not used elsewhere
// interface Announcement {
//   title: string;
//   meta: string;
//   content: string;
// }

@Component({
  selector: 'app-attendance-dashboard',
  standalone: true,
  imports: [
    CommonModule, CardModule, ButtonModule, 
    TableModule, TagModule, TooltipModule
  ],
  template: `
    <div class="p-4 sm:p-6 space-y-8 animate-fadeIn dark:bg-slate-950 min-h-screen">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" 
             class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300">
          <div [ngClass]="stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'" 
               class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">
            <i [class]="stat.icon"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-800 dark:text-white leading-none">{{ stat.value }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-white tracking-tight">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button *ngFor="let action of quickActions" (click)="handleQuickAction(action.action)"
                  class="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 group border border-transparent hover:border-blue-400">
            <i [class]="action.icon" class="text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-sm font-semibold tracking-wide">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Today's Schedule - Now taking full width since announcements is removed -->
      <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-blue-500"></i>
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Today's Schedule</h3>
          </div>
          <span class="text-xs font-medium text-gray-400">{{ todayDate }}</span>
        </div>
        
        <p-table [value]="classes" class="w-full" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr class="bg-slate-50 dark:bg-slate-800/50">
              <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Subject</th>
              <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Professor</th>
              <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Time</th>
              <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-class>
            <tr class="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="p-4">
                <span class="font-bold text-gray-800 dark:text-gray-200 block">{{ class.subject }}</span>
                <span class="text-xs text-gray-400">{{ class.room }}</span>
              </td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ class.professor }}</td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ class.time }}</td>
              <td class="p-4">
                <p-tag [value]="class.status | uppercase" [severity]="getSeverity(class.status)"></p-tag>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class StudentAttendanceDashboardComponent implements OnInit, OnDestroy {
  todayDate: string = '';
  private updateTimer: any;

  stats = [
    { label: 'Total Classes', value: '8', icon: 'pi pi-book', color: 'blue' },
    { label: "Today's Status", value: 'Present', icon: 'pi pi-check', color: 'yellow' },
    { label: 'Overall Attendance', value: '92%', icon: 'pi pi-chart-line', color: 'blue' },
    // Removed 'New Announcements' stat since we're removing announcements section
    { label: 'Upcoming Classes', value: '3', icon: 'pi pi-clock', color: 'yellow' }
  ];

  quickActions = [
    { label: 'Gate Attendance', icon: 'pi pi-sign-in', action: 'gate' },
    { label: 'Subject Attendance', icon: 'pi pi-calendar-check', action: 'subject' },
    { label: 'Schedule', icon: 'pi pi-clock', action: 'schedule' },
    { label: 'Reports', icon: 'pi pi-chart-bar', action: 'reports' } // Changed from 'Announcements'
  ];

  classes: TodayClass[] = [
    { subject: 'Mathematics', room: 'Room 204', professor: 'Prof. Santos', time: '8:00 AM - 9:30 AM', status: 'present' },
    { subject: 'Science', room: 'Room 305', professor: 'Dr. Rodriguez', time: '10:00 AM - 11:30 AM', status: 'present' },
    { subject: 'Programming', room: 'Lab 102', professor: 'Prof. Lee', time: '1:00 PM - 2:30 PM', status: 'upcoming' }
  ];


  ngOnInit() {
    this.todayDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  }

  ngOnDestroy() {
    if (this.updateTimer) clearInterval(this.updateTimer);
  }

  handleQuickAction(action: string) {
    console.log(`Navigating to: ${action}`);
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | undefined {
    switch (status) {
      case 'present': return 'success';
      case 'upcoming': return 'info';
      case 'late': return 'warning';
      case 'absent': return 'danger';
      default: return 'info';
    }
  }
}