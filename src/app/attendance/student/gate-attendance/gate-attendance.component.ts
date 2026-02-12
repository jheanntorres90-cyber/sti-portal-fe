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

interface GateLog {
  date: string;
  day: string;
  timeIn: string;
  timeInMethod: string;
  timeOut: string;
  timeOutMethod: string;
  status: 'complete' | 'in-only' | 'no-entry';
}

@Component({
  selector: 'app-gate-attendance',
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
          <div [class]="stat.bg + ' ' + stat.color" class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner">
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
              <i class="fa-solid fa-clock-rotate-left text-blue-500"></i>
              <span class="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase">Today's Activity</span>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                <i class="fa-solid fa-right-to-bracket text-emerald-600 text-xl"></i>
                <div>
                  <p class="text-[10px] font-black text-emerald-700 dark:text-emerald-500 uppercase">Time In</p>
                  <p class="text-lg font-bold text-gray-800 dark:text-white">{{ todayActivity.in }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                <i class="fa-solid fa-right-from-bracket text-orange-600 text-xl"></i>
                <div>
                  <p class="text-[10px] font-black text-orange-700 dark:text-orange-500 uppercase">Time Out</p>
                  <p class="text-lg font-bold text-gray-800 dark:text-white">{{ todayActivity.out }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm p-6">
            <h3 class="font-bold mb-6 flex items-center gap-2 dark:text-gray-200">
              <i class="fa-solid fa-sliders text-blue-500"></i> Filter Records
            </h3>
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase">Date Range</label>
                <p-calendar [(ngModel)]="dateRange" selectionMode="range" [readonlyInput]="true" [showIcon]="true" placeholder="Select dates" styleClass="w-full custom-calendar"></p-calendar>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase">Entry Type</label>
                <p-dropdown [options]="entryTypes" [(ngModel)]="selectedEntryType" placeholder="All Entry Types" styleClass="w-full" [showClear]="true"></p-dropdown>
              </div>
              <div class="grid grid-cols-2 gap-3 pt-4">
                <button (click)="applyFilters()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none">Apply</button>
                <button (click)="clearFilters()" class="w-full py-3 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-300 rounded-xl font-bold transition-all">Clear</button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <p-table [value]="filteredData" [paginator]="true" [rows]="10" responsiveLayout="scroll" styleClass="p-datatable-sm custom-table">
              <ng-template pTemplate="header">
                <tr>
                  <th class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">Log Date</th>
                  <th class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">In / Out</th>
                  <th class="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-record>
                <tr class="border-b dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-bold block text-gray-800 dark:text-gray-200">{{ record.date | date:'mediumDate' }}</span>
                    <span class="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{{ record.day }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-6">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-arrow-right text-emerald-500 text-[10px]"></i>
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ record.timeIn }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-arrow-left text-orange-500 text-[10px]"></i>
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ record.timeOut }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <p-tag [severity]="getSeverity(record.status)" [value]="getStatusText(record.status)" styleClass="text-[9px] font-black tracking-widest uppercase"></p-tag>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3" class="text-center p-8 text-gray-400">No records found for the selected filters.</td>
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
      .p-datatable .p-datatable-thead > tr > th { border: none; }
      .p-tag { padding: 0.25rem 0.75rem; border-radius: 8px; }
      .p-calendar input { border-radius: 12px; font-size: 14px; padding: 0.75rem; width: 100%; }
      .p-dropdown { border-radius: 12px; width: 100%; }
    }
  `]
})
export class GateAttendanceComponent implements OnInit {
  allData: GateLog[] = [
    { date: "2025-09-11", day: "Thursday", timeIn: "07:45 AM", timeInMethod: "Face Recognition", timeOut: "03:30 PM", timeOutMethod: "Face Recognition", status: "complete" },
    { date: "2025-09-10", day: "Wednesday", timeIn: "07:50 AM", timeInMethod: "Face Recognition", timeOut: "03:35 PM", timeOutMethod: "Face Recognition", status: "complete" },
    { date: "2025-09-09", day: "Tuesday", timeIn: "08:05 AM", timeInMethod: "Face Recognition", timeOut: "03:20 PM", timeOutMethod: "Face Recognition", status: "complete" },
    { date: "2025-09-06", day: "Saturday", timeIn: "08:10 AM", timeInMethod: "Face Recognition", timeOut: "-", timeOutMethod: "-", status: "in-only" },
    { date: "2025-09-02", day: "Tuesday", timeIn: "-", timeInMethod: "-", timeOut: "-", timeOutMethod: "-", status: "no-entry" }
  ];

  filteredData: GateLog[] = [];
  dateRange: Date[] | undefined;
  selectedEntryType: string | undefined;
  todayDate: number = Date.now();
  todayActivity = { in: '07:45 AM', out: 'Pending' };

  entryTypes = [
    { label: 'Complete In/Out', value: 'complete' },
    { label: 'Time In Only', value: 'in-only' },
    { label: 'No Entry', value: 'no-entry' }
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.filteredData = [...this.allData];
  }

  get stats() {
    return [
      { label: 'Total Entries', value: this.filteredData.length, icon: 'fa-solid fa-fingerprint', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Complete', value: this.filteredData.filter(r => r.status === 'complete').length, icon: 'fa-solid fa-circle-check', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { label: 'Missing Out', value: this.filteredData.filter(r => r.status === 'in-only').length, icon: 'fa-solid fa-triangle-exclamation', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      { label: 'Absences', value: this.filteredData.filter(r => r.status === 'no-entry').length, icon: 'fa-solid fa-circle-xmark', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' }
    ];
  }

  applyFilters() {
    this.filteredData = this.allData.filter(record => {
      const typeMatch = !this.selectedEntryType || record.status === this.selectedEntryType;
      
      let dateMatch = true;
      if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
        const recordDate = new Date(record.date).getTime();
        const start = this.dateRange[0].getTime();
        const end = this.dateRange[1].getTime();
        dateMatch = recordDate >= start && recordDate <= end;
      }
      
      return typeMatch && dateMatch;
    });

    this.messageService.add({ 
      severity: 'info', 
      summary: 'Filters Applied', 
      detail: `Found ${this.filteredData.length} records.` 
    });
  }

  clearFilters() {
    this.dateRange = undefined;
    this.selectedEntryType = undefined;
    this.filteredData = [...this.allData];
  }

  getStatusText(status: string) {
    if (status === 'complete') return 'Complete';
    if (status === 'in-only') return 'Missing Out';
    return 'No Entry';
  }

  getSeverity(status: string): "success" | "warning" | "danger" | "info" {
    switch (status) {
      case 'complete': return 'success';
      case 'in-only': return 'warning';
      case 'no-entry': return 'danger';
      default: return 'info';
    }
  }
}