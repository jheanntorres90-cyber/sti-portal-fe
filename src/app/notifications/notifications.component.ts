import { Component } from '@angular/core'; // Fixed: Changed from @angular/common
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Notifications</h1>
          <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Updates from your faculty portals</p>
        </div>
        <button class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Mark all as read</button>
      </div>

      <div class="space-y-4">
        <div *ngFor="let n of alerts" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex gap-4 items-start hover:shadow-md transition-all">
          <div [ngClass]="n.color" class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
            <i [class]="n.icon + ' text-lg'"></i>
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <h3 class="font-bold text-slate-800 dark:text-white text-sm">{{ n.title }}</h3>
              <span class="text-[10px] font-bold text-slate-400 uppercase">{{ n.time }}</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ n.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationsComponent {
  alerts = [
    { title: 'Grade Deadline', desc: 'Prelim grading period for BSIT-3A ends tomorrow at 5:00 PM.', time: '2h ago', icon: 'pi pi-exclamation-circle', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' },
    { title: 'Attendance Alert', desc: 'Juan Dela Cruz (BSIT-1B) has been marked absent for 3 consecutive days.', time: '5h ago', icon: 'pi pi-calendar-times', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20' },
    { title: 'System Update', desc: 'The Faculty Portal has been updated to version 2.4. New export features are now available.', time: '1d ago', icon: 'pi pi-cog', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' }
  ];
}