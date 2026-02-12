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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-6 border-b dark:border-slate-800 flex items-center justify-between">
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
                    <span class="font-bold block">{{ class.subject }}</span>
                    <span class="text-xs text-blue-500 font-medium">{{ class.room }}</span>
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

          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <i class="pi pi-megaphone text-yellow-500"></i> Announcements
              </h3>
              <a href="#" class="text-blue-600 text-xs font-bold hover:underline tracking-tighter">VIEW ALL</a>
            </div>
            <div class="space-y-6">
              <div *ngFor="let item of announcements" class="pb-4 border-b dark:border-slate-800 last:border-0 last:pb-0 group">
                <h4 class="font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 cursor-pointer transition-colors">{{ item.title }}</h4>
                <p class="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-tight">{{ item.meta }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
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
    { label: 'New Updates', value: '1', icon: 'pi pi-bell', color: 'yellow' }
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

  announcements = [
    { 
      title: 'July 3: Holiday Notice', 
      meta: 'Posted by Admin • 2 hours ago', 
      content: 'Office transactions will be suspended in celebration of SHS and Tertiary graduation!' 
    },
    { 
      title: 'Portal Maintenance', 
      meta: 'Posted by IT Dept • 1 day ago', 
      content: 'The student portal will undergo maintenance this coming Sunday at 12:00 AM.' 
    }
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