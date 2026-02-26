import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

interface TodayClass {
  subject: string;
  room: string;
  professor: string;
  time: string;
  status: 'present' | 'upcoming' | 'absent' | 'late';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      
      <main class="max-w-7xl mx-auto w-full space-y-8 animate-fadeIn">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let stat of stats" 
               class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300">
            <div [ngClass]="stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'" 
                 class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">
              <i [class]="stat.icon"></i>
            </div>
            <div>
              <p class="text-2xl font-bold leading-none tracking-tighter">{{ stat.value }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 class="text-lg font-bold mb-4 tracking-tight">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button *ngFor="let action of quickActions" (click)="handleQuickAction(action.action)"
                    class="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 group border border-transparent hover:border-blue-400">
              <i [class]="action.icon" class="text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <span class="text-sm font-semibold tracking-wide">{{ action.label }}</span>
            </button>
          </div>
        </div>

        <!-- Today's Schedule - Dark mode removed from table -->
        <div class="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-blue-500"></i>
              <h3 class="text-lg font-bold">Today's Schedule</h3>
            </div>
            <button (click)="toggleTheme()" class="p-2 text-slate-400 hover:text-blue-500 transition-colors" pTooltip="Toggle Dark Mode">
               <i class="pi" [ngClass]="isDarkMode() ? 'pi-sun' : 'pi-moon'"></i>
            </button>
          </div>
          
          <p-table [value]="classes" class="w-full" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr class="bg-slate-50">
                <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Subject</th>
                <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Professor</th>
                <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Time</th>
                <th class="p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-class>
              <tr class="border-b hover:bg-slate-50 transition-colors">
                <td class="p-4">
                  <span class="font-bold block">{{ class.subject }}</span>
                  <span class="text-xs text-blue-500 font-medium">{{ class.room }}</span>
                </td>
                <td class="p-4 text-sm text-gray-600">{{ class.professor }}</td>
                <td class="p-4 text-sm text-gray-600">{{ class.time }}</td>
                <td class="p-4">
                  <p-tag [value]="class.status | uppercase" [severity]="getSeverity(class.status)"></p-tag>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </main>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  isDarkMode = signal(false);

  stats = [
    { label: 'Latest Grade', value: '80.00', icon: 'pi pi-star', color: 'blue' },
    { label: "Today's Classes", value: '2', icon: 'pi pi-clock', color: 'yellow' },
    { label: 'Attendance', value: '92%', icon: 'pi pi-chart-line', color: 'blue' },
    { label: 'Upcoming Tasks', value: '3', icon: 'pi pi-check-square', color: 'yellow' }
  ];

  quickActions = [
    { label: 'Grades', icon: 'pi pi-file', action: 'grades' },
    { label: 'Schedule', icon: 'pi pi-calendar', action: 'schedule' },
    { label: 'Campus Info', icon: 'pi pi-info-circle', action: 'about' },
    { label: 'Feedback', icon: 'pi pi-comment', action: 'feedback' }
  ];

  classes: TodayClass[] = [
    { subject: 'Programming Languages', room: 'Room 206', professor: 'J. Bernabe', time: '10:00 AM - 1:00 PM', status: 'present' },
    { subject: 'Web Systems & Tech', room: 'Room 206', professor: 'E. Enerlan', time: '1:00 PM - 3:00 PM', status: 'upcoming' }
  ];

  constructor() {
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }

  toggleTheme() { this.isDarkMode.update(v => !v); }
  
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