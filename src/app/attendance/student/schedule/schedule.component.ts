import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClassInfo {
  code: string;
  name: string;
  professor: string;
  schedule: string;
  room: string;
  section: string;
  units: number;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Class Schedule</h1>
          <p class="text-gray-500 dark:text-slate-400">Manage and view your weekly academic load</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 flex shadow-sm">
            <button (click)="viewMode = 'table'" 
              [class]="viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'"
              class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <i class="fas fa-table"></i> Table
            </button>
            <button (click)="viewMode = 'list'" 
              [class]="viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'"
              class="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <i class="fas fa-list"></i> List
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><i class="fas fa-calendar-week fa-lg"></i></div>
          <div>
            <div class="text-2xl font-bold text-gray-800 dark:text-white">8</div>
            <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Weekly Classes</div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl"><i class="fas fa-book fa-lg"></i></div>
          <div>
            <div class="text-2xl font-bold text-gray-800 dark:text-white">4</div>
            <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Subjects</div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl"><i class="fas fa-clock fa-lg"></i></div>
          <div>
            <div class="text-2xl font-bold text-gray-800 dark:text-white">20</div>
            <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">Hours/Week</div>
          </div>
        </div>
      </div>

      <div *ngIf="viewMode === 'table'" class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th class="p-4 border-b dark:border-slate-800">Time Slot</th>
                <th *ngFor="let day of weekDays" class="p-4 border-b dark:border-slate-800">{{ day }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              <tr *ngFor="let slot of scheduleTable" class="group">
                <td class="p-4 bg-gray-50/30 dark:bg-slate-800/20 font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap border-r dark:border-slate-800">
                  {{ slot.time }}
                </td>
                <td *ngFor="let day of weekDaysLower" class="p-2 min-w-[160px]">
                  <div *ngIf="slot[day]" (click)="openDetails(slot[day])"
                    class="p-3 rounded-xl border transition-all cursor-pointer hover:shadow-lg active:scale-95"
                    [ngClass]="{
                      'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50 hover:bg-blue-100': !hasConflict(slot[day]),
                      'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800/50': hasConflict(slot[day])
                    }">
                    <div class="text-blue-700 dark:text-blue-400 font-black text-[10px] mb-1 uppercase">{{ classData[slot[day]].code }}</div>
                    <div class="text-gray-800 dark:text-gray-100 font-bold text-sm leading-tight mb-2">{{ classData[slot[day]].name }}</div>
                    <div class="flex items-center gap-2 text-[10px] text-gray-500 dark:text-slate-400 font-medium italic">
                      <span><i class="fas fa-door-open"></i> {{ classData[slot[day]].room }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="viewMode === 'list'" class="space-y-8 animate-in fade-in duration-500">
        <div *ngFor="let day of listScheduleData" class="space-y-4">
          <h3 class="flex items-center gap-2 font-black text-gray-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] border-b dark:border-slate-800 pb-2">
            <i class="fas fa-calendar-day text-blue-500"></i> {{ day.day }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let clsKey of day.classes" (click)="openDetails(clsKey)"
              class="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all">
              <div class="flex justify-between items-start mb-3">
                <span class="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[10px] font-black tracking-widest">{{ classData[clsKey].code }}</span>
                <span class="text-xs font-mono text-gray-400 group-hover:text-blue-500 transition-colors">{{ classData[clsKey].schedule.split(' ')[1] }}</span>
              </div>
              <div class="font-bold text-gray-800 dark:text-white text-lg group-hover:translate-x-1 transition-transform">{{ classData[clsKey].name }}</div>
              <div class="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
                 <span><i class="fas fa-user-tie mr-1 opacity-50"></i> {{ classData[clsKey].professor }}</span>
                 <span class="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{{ classData[clsKey].room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
          <div class="p-6 bg-blue-600 text-white relative">
            <button (click)="closeModal()" class="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors"><i class="fas fa-times"></i></button>
            <div class="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Subject Information</div>
            <h3 class="text-2xl font-bold">{{ selectedClass?.code }}</h3>
            <p class="text-blue-100 text-sm font-medium">{{ selectedClass?.name }}</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-2 gap-6">
               <div>
                 <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Professor</label>
                 <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ selectedClass?.professor }}</div>
               </div>
               <div>
                 <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Room</label>
                 <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ selectedClass?.room }}</div>
               </div>
               <div class="col-span-2">
                 <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Weekly Schedule</label>
                 <div class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ selectedClass?.schedule }}</div>
               </div>
            </div>
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 active:scale-95">
              Full Syllabus & Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentScheduleComponent implements OnInit {
  viewMode: 'table' | 'list' = 'table';
  selectedClass: ClassInfo | null = null;
  isModalOpen = false;

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  weekDaysLower = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  classData: { [key: string]: ClassInfo } = {
    'WEB101-A': { code: 'WEB101', name: 'Web Development', professor: 'Prof. Santos', schedule: 'MWF 8:00 - 9:30 AM', room: 'Room 301', section: 'Section A', units: 3 },
    'DB201-B': { code: 'DB201', name: 'Database Management', professor: 'Prof. Reyes', schedule: 'MTH 10:00 - 11:30 AM', room: 'Room 205', section: 'Section B', units: 3 },
    'PROG101-C': { code: 'PROG101', name: 'Programming Fundamentals', professor: 'Prof. Cruz', schedule: 'MWF 1:00 - 2:30 PM', room: 'Room 402', section: 'Section C', units: 3 },
    'NET301-D': { code: 'NET301', name: 'Network Administration', professor: 'Prof. Lim', schedule: 'TTH 3:00 - 4:30 PM', room: 'Lab 102', section: 'Section D', units: 3 }
  };

  scheduleTable: any[] = [
    { time: '8:00 - 9:30 AM', monday: 'WEB101-A', tuesday: null, wednesday: 'WEB101-A', thursday: null, friday: 'WEB101-A' },
    { time: '10:00 - 11:30 AM', monday: 'DB201-B', tuesday: 'DB201-B', wednesday: null, thursday: 'DB201-B', friday: null },
    { time: '1:00 - 2:30 PM', monday: 'PROG101-C', tuesday: null, wednesday: 'PROG101-C', thursday: null, friday: 'PROG101-C' },
    { time: '3:00 - 4:30 PM', monday: null, tuesday: 'NET301-D', wednesday: null, thursday: 'NET301-D', friday: null }
  ];

  listScheduleData = [
    { day: 'Monday', classes: ['WEB101-A', 'DB201-B', 'PROG101-C'] },
    { day: 'Tuesday', classes: ['DB201-B', 'NET301-D'] },
    { day: 'Wednesday', classes: ['WEB101-A', 'PROG101-C'] },
    { day: 'Thursday', classes: ['DB201-B', 'NET301-D'] },
    { day: 'Friday', classes: ['WEB101-A', 'PROG101-C'] }
  ];

  ngOnInit(): void {}

  hasConflict(key: string): boolean {
    // Logic to detect if a class has issues (could be expanded)
    return false;
  }

  openDetails(key: string) {
    this.selectedClass = this.classData[key];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedClass = null;
  }
}