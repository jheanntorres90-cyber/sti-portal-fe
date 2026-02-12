import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface SubjectLog {
  date: string;
  day: string;
  subject: string;
  timeIn: string;
  timeOut: string;
  method: string;
  status: 'present' | 'absent' | 'late';
}

@Component({
  selector: 'app-subject-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, 
    ButtonModule, DropdownModule, CalendarModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 sm:p-8 bg-gray-50 dark:bg-slate-950 min-h-screen space-y-8">
      <p-toast></p-toast>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div [class]="stat.bg + ' ' + stat.color" class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl">
            <i [class]="stat.icon"></i>
          </div>
          <div>
            <p class="text-2xl font-black text-gray-800 dark:text-white leading-none">{{ stat.value }}</p>
            <p class="text-xs font-bold text-gray-400 uppercase mt-2 tracking-widest">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-6">
          
          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-5 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
              <i class="fa-solid fa-clock text-blue-500"></i>
              <span class="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase">Today's Classes</span>
            </div>
            <div class="p-6 space-y-4">
              <div *ngFor="let class of todayClasses" 
                   class="flex items-center gap-4 p-4 rounded-2xl border transition-all"
                   [ngClass]="class.borderClass">
                <div [class]="class.iconBg" class="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg">
                  <i [class]="class.icon"></i>
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-800 dark:text-white leading-tight">{{ class.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ class.time }}</p>
                </div>
                <span [class]="class.statusClass" class="text-[10px] font-black uppercase px-2 py-1 rounded-lg">
                  {{ class.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm p-6">
            <h3 class="font-bold mb-6 flex items-center gap-2 dark:text-gray-200 text-sm uppercase">
              <i class="fa-solid fa-filter text-blue-500"></i> Filter Records
            </h3>
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase">Date Range</label>
                <p-calendar [(ngModel)]="dateRange" selectionMode="range" [showIcon]="true" placeholder="Select dates" styleClass="w-full"></p-calendar>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase">Subject</label>
                <p-dropdown [options]="subjects" [(ngModel)]="selectedSubject" placeholder="All Subjects" styleClass="w-full" [showClear]="true"></p-dropdown>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase">Status</label>
                <p-dropdown [options]="statuses" [(ngModel)]="selectedStatus" placeholder="All Status" styleClass="w-full" [showClear]="true"></p-dropdown>
              </div>
              <div class="grid grid-cols-2 gap-3 pt-4">
                <button (click)="applyFilters()" class="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all">Apply</button>
                <button (click)="clearFilters()" class="py-3 border border-gray-200 dark:border-slate-800 dark:text-gray-300 rounded-xl font-bold transition-all">Clear</button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-5 flex justify-between items-center border-b dark:border-slate-800">
               <span class="font-bold text-sm uppercase dark:text-gray-200 tracking-tight">Attendance Logs</span>
               <div class="flex gap-2">
                 <button class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Export Excel">
                   <i class="fa-solid fa-file-excel text-lg"></i>
                 </button>
               </div>
            </div>
            
            <p-table [value]="filteredData" [paginator]="true" [rows]="8" responsiveLayout="scroll" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr class="bg-slate-50/50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date/Subject</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Time</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Method</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-log>
                <tr class="border-b dark:border-slate-800 hover:bg-slate-50/30 transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-bold block text-gray-800 dark:text-gray-200">{{ log.subject }}</span>
                    <span class="text-[10px] text-gray-400">{{ log.date | date:'mediumDate' }} • {{ log.day }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="text-xs font-bold text-gray-600 dark:text-gray-400">
                      {{ log.timeIn }} - {{ log.timeOut }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="text-xs text-gray-500">
                      <i class="fa-solid fa-id-card-clip mr-1 text-blue-400"></i> {{ log.method }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <p-tag [severity]="getSeverity(log.status)" [value]="log.status.toUpperCase()" styleClass="text-[9px] font-black"></p-tag>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th { background: transparent; border: none; }
      .p-calendar input, .p-dropdown { border-radius: 12px; padding: 0.6rem; }
      .p-tag { border-radius: 6px; padding: 0.2rem 0.6rem; }
    }
  `]
})
export class SubjectAttendanceComponent implements OnInit {
  allData: SubjectLog[] = [
    { date: "2025-09-11", day: "Thursday", subject: "Database Management", timeIn: "08:00 AM", timeOut: "09:00 AM", method: "RFID", status: "present" },
    { date: "2025-09-11", day: "Thursday", subject: "Network Admin", timeIn: "09:15 AM", timeOut: "10:15 AM", method: "RFID", status: "late" },
    { date: "2025-09-10", day: "Wednesday", subject: "Web Development", timeIn: "-", timeOut: "-", method: "-", status: "absent" },
  ];

  filteredData: SubjectLog[] = [];
  dateRange: Date[] | undefined;
  selectedSubject: string | undefined;
  selectedStatus: string | undefined;

  subjects = ['Database Management', 'Network Administration', 'Web Development', 'Physical Education'];
  statuses = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Late', value: 'late' }
  ];

  todayClasses = [
    { name: 'Database Management', time: '08:00 AM - 09:00 AM', status: 'Present', icon: 'fa-solid fa-database', iconBg: 'bg-red-500', borderClass: 'border-red-100 bg-red-50/30', statusClass: 'bg-emerald-100 text-emerald-700' },
    { name: 'Network Admin', time: '09:15 AM - 10:15 AM', status: 'Upcoming', icon: 'fa-solid fa-network-wired', iconBg: 'bg-blue-500', borderClass: 'border-blue-100 bg-blue-50/30', statusClass: 'bg-blue-100 text-blue-700' },
    { name: 'Web Development', time: '10:30 AM - 11:30 AM', status: 'Upcoming', icon: 'fa-solid fa-code', iconBg: 'bg-purple-500', borderClass: 'border-purple-100 bg-purple-50/30', statusClass: 'bg-blue-100 text-blue-700' }
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.filteredData = [...this.allData];
  }

  get stats() {
    return [
      { label: 'Total Classes', value: 48, icon: 'fa-solid fa-calendar-check', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Present', value: 42, icon: 'fa-solid fa-user-check', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { label: 'Absent', value: 3, icon: 'fa-solid fa-user-times', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      { label: 'Attendance Rate', value: '94%', icon: 'fa-solid fa-percentage', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' }
    ];
  }

  applyFilters() {
    this.filteredData = this.allData.filter(log => {
      const subjectMatch = !this.selectedSubject || log.subject === this.selectedSubject;
      const statusMatch = !this.selectedStatus || log.status === this.selectedStatus;
      return subjectMatch && statusMatch;
    });

    this.messageService.add({ severity: 'info', summary: 'Filters Applied', detail: `Showing ${this.filteredData.length} records.` });
  }

  clearFilters() {
    this.dateRange = undefined;
    this.selectedSubject = undefined;
    this.selectedStatus = undefined;
    this.filteredData = [...this.allData];
  }

  getSeverity(status: string): "success" | "warning" | "danger" | "info" {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'danger';
      default: return 'info';
    }
  }
}