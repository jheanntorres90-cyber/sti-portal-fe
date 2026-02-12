import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClassBlock {
  code: string;
  name: string;
  section: string;
  room: string;
  students: number;
  time: string;
  days: string[];
}

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-50 dark:bg-slate-950 min-h-screen space-y-8 transition-colors duration-300">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Teaching Schedule</h1>
          <p class="text-sm text-gray-500 dark:text-slate-400 font-medium">Academic Year 2025-2026 | 2nd Semester</p>
        </div>
        
        <div class="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <button (click)="viewMode = 'table'" 
            [ngClass]="viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'"
            class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            <i class="pi pi-table"></i> TABLE VIEW
          </button>
          <button (click)="viewMode = 'list'" 
            [ngClass]="viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'"
            class="px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            <i class="pi pi-list"></i> LIST VIEW
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let stat of stats" class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div [class]="stat.bg + ' ' + stat.color + ' ' + stat.darkBg" class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i [class]="stat.icon"></i>
          </div>
          <div>
            <div class="text-2xl font-black text-gray-900 dark:text-white">{{ stat.value }}</div>
            <div class="text-[11px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="viewMode === 'table'" class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse table-fixed min-w-[1100px]">
            <thead>
              <tr class="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                <th class="p-5 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider w-36 text-center">Time Slot</th>
                <th *ngFor="let day of days" class="p-5 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let time of timeSlots" class="border-b border-gray-50 dark:border-slate-800 group last:border-0">
                <td class="p-4 text-[10px] font-bold text-blue-800 dark:text-blue-400 bg-gray-50/30 dark:bg-slate-900/50 text-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  {{ time }}
                </td>
                <td *ngFor="let day of days" class="p-2 align-top">
                  <div *ngIf="getClassForSlot(day, time) as classItem" 
                    (click)="openDetails(classItem)"
                    class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm border-l-4 border-l-blue-600 dark:border-l-blue-500 p-3 rounded-xl hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group/card h-full">
                    <div class="text-[9px] font-black text-blue-600 dark:text-blue-400 mb-1 truncate">{{ classItem.code }}</div>
                    <div class="text-[10px] font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover/card:text-blue-800 dark:group-hover/card:text-blue-300">{{ classItem.name }}</div>
                    <div class="text-[9px] text-gray-400 dark:text-slate-500 flex items-center gap-1 font-bold italic">
                       <i class="pi pi-map-marker text-[8px]"></i> {{ classItem.room }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="viewMode === 'list'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div *ngFor="let day of days" class="space-y-4">
          <h3 class="flex items-center gap-3 text-lg font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
            <span class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20"><i class="pi pi-calendar"></i></span>
            {{ day }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ng-container *ngFor="let classItem of classes">
              <div *ngIf="classItem.days.includes(day)" 
                (click)="openDetails(classItem)"
                class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all hover:shadow-xl group">
                <div class="flex justify-between items-start mb-4">
                  <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-full ring-1 ring-blue-100 dark:ring-blue-900/50">{{ classItem.time }}</span>
                  <i class="pi pi-chevron-right text-gray-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors"></i>
                </div>
                <h4 class="font-black text-gray-900 dark:text-white text-base leading-tight">{{ classItem.code }}</h4>
                <p class="text-sm text-gray-500 dark:text-slate-400 font-medium mt-1">{{ classItem.name }}</p>
                <div class="mt-6 pt-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                  <span class="flex items-center gap-1.5"><i class="pi pi-users text-blue-500"></i> {{ classItem.section }}</span>
                  <span class="flex items-center gap-1.5"><i class="pi pi-map-marker text-red-500"></i> {{ classItem.room }}</span>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-md">
        <div class="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
           <div class="p-8 text-center">
              <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
                <i class="pi pi-book"></i>
              </div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{{selectedClass?.code}}</h3>
              <p class="text-gray-500 dark:text-slate-400 font-medium mb-8 text-sm">{{selectedClass?.name}}</p>
              
              <div class="grid grid-cols-2 gap-4 mb-8 text-left">
                <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-1">Room</p>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{selectedClass?.room}}</p>
                </div>
                <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase mb-1">Section</p>
                  <p class="font-bold text-gray-800 dark:text-gray-100">{{selectedClass?.section}}</p>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button class="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 dark:hover:bg-blue-400 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all">
                  VIEW CLASS LIST
                </button>
                <button (click)="isModalOpen = false" class="w-full bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 py-3 rounded-2xl font-bold text-xs hover:text-gray-600 dark:hover:text-gray-300 transition-all">
                  CLOSE
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class MyScheduleComponent implements OnInit {
  viewMode: 'table' | 'list' = 'table';
  selectedClass: ClassBlock | null = null;
  isModalOpen = false;

  stats = [
    { label: 'Weekly Sessions', value: '14', icon: 'pi pi-calendar', color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/30' },
    { label: 'Total Units', value: '18.0', icon: 'pi pi-star', color: 'text-purple-600', bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/30' },
    { label: 'Rooms Assigned', value: '4', icon: 'pi pi-map', color: 'text-amber-600', bg: 'bg-amber-100', darkBg: 'dark:bg-amber-900/30' }
  ];

  timeSlots = [
    '07:00 - 08:30 AM', 
    '08:30 - 10:00 AM', 
    '10:00 - 11:30 AM', 
    '11:30 - 01:00 PM', 
    '01:00 - 02:30 PM', 
    '02:30 - 04:00 PM', 
    '04:00 - 05:30 PM',
    '05:30 - 07:00 PM'
  ];

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  classes: ClassBlock[] = [
    { code: 'WEB101', name: 'Web Development', section: 'Section A', room: 'Room 301', students: 32, time: '07:00 - 08:30 AM', days: ['Monday', 'Wednesday', 'Friday'] },
    { code: 'DB201', name: 'Database Management', section: 'Section B', room: 'Room 205', students: 28, time: '08:30 - 10:00 AM', days: ['Tuesday', 'Thursday'] },
    { code: 'PROG101', name: 'Programming Fundamentals', section: 'Section C', room: 'Room 402', students: 30, time: '10:00 - 11:30 AM', days: ['Monday', 'Wednesday'] },
    { code: 'NET301', name: 'Network Administration', section: 'Section D', room: 'Lab 102', students: 25, time: '01:00 - 02:30 PM', days: ['Tuesday', 'Thursday'] },
    { code: 'CAP102', name: 'Capstone Project 1', section: 'Section F', room: 'Lab 105', students: 15, time: '08:30 - 10:00 AM', days: ['Saturday'] },
    { code: 'GDEV202', name: 'Game Development', section: 'Section E', room: 'Lab 103', students: 22, time: '05:30 - 07:00 PM', days: ['Friday'] }
  ];

  ngOnInit() {}

  getClassForSlot(day: string, time: string): ClassBlock | undefined {
    return this.classes.find(c => c.time === time && c.days.includes(day));
  }

  openDetails(classInfo: ClassBlock) {
    this.selectedClass = classInfo;
    this.isModalOpen = true;
  }
}