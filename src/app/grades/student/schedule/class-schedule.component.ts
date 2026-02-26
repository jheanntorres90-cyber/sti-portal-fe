import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface ScheduleEntry {
  subject: string;
  day: string[];
  time: string;
  room: string;
  professor: string;
  color?: string;
}

@Component({
  selector: 'app-class-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    SelectButtonModule,
    TagModule,
    TooltipModule
  ],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      
      <main class="max-w-7xl mx-auto w-full space-y-6 animate-fadeIn">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-1">
            <h2 class="text-3xl font-black tracking-tight">Weekly Schedule</h2>
            <p class="text-slate-500 font-medium italic">Stay organized with your class timetable</p>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <div class="flex flex-col">
              <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Academic Period</label>
              <p-dropdown 
                [options]="terms" 
                [(ngModel)]="selectedTerm" 
                styleClass="w-full md:w-64 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              </p-dropdown>
            </div>
            <div class="flex flex-col">
              <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Layout</label>
              <p-selectButton 
                [options]="viewOptions" 
                [(ngModel)]="activeView" 
                optionLabel="label" 
                optionValue="value"
                styleClass="custom-select-button">
              </p-selectButton>
            </div>
          </div>
        </div>

        <div class="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <i class="pi pi-info-circle text-xl"></i>
            <span class="text-sm font-bold tracking-tight">
              Total Units: <span class="opacity-75">166.00 required</span> • 138.00 taken • <span class="underline decoration-2">28.00 needed</span>
            </span>
          </div>
          <div class="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">AY 2024-2025 2nd SEM</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div *ngFor="let stat of stats" class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div [ngClass]="stat.color" class="w-12 h-12 rounded-xl flex items-center justify-center text-xl">
              <i [class]="stat.icon"></i>
            </div>
            <div>
              <p class="text-xl font-bold leading-none tracking-tighter">{{ stat.value }}</p>
              <p class="text-xs text-gray-400 font-bold uppercase mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeView === 'table'" class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="p-4 text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800 w-32">Time</th>
                  <th *ngFor="let day of days" class="p-4 text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800">
                    {{ day }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let slot of timeSlots" class="border-b dark:border-slate-800 last:border-0">
                  <td class="p-4 text-[11px] font-bold text-slate-500 bg-slate-50/30 dark:bg-slate-800/20 italic">{{ slot }}</td>
                  <td *ngFor="let day of days" class="p-2 min-w-[150px]">
                    <div *ngFor="let cls of getClassesForSlot(day, slot)" 
                         class="p-3 rounded-xl border-l-4 mb-2 bg-slate-50 dark:bg-slate-800/50 transition-transform hover:scale-[1.02] cursor-pointer"
                         [ngStyle]="{'border-left-color': cls.color || '#3b82f6'}">
                      <div class="text-[10px] font-black text-blue-500 truncate">{{ cls.subject }}</div>
                      <div class="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <i class="pi pi-map-marker text-[8px]"></i> {{ cls.room }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="activeView === 'list'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let day of days" class="space-y-4">
            <h3 class="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-slate-400 ml-2">
              <i class="pi pi-calendar-plus text-blue-500"></i> {{ day }}
            </h3>
            
            <div *ngIf="scheduleByDay[day].length === 0" class="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p class="text-xs font-bold text-slate-400">No classes scheduled</p>
            </div>

            <div *ngFor="let cls of scheduleByDay[day]" 
                 class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-blue-900/30 px-2 py-1 rounded-md">{{ cls.time }}</span>
                <i class="pi pi-external-link text-slate-300 group-hover:text-blue-500 transition-colors text-xs"></i>
              </div>
              <h4 class="font-bold text-sm mb-3 leading-snug">{{ cls.subject }}</h4>
              <div class="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span class="flex items-center gap-1"><i class="pi pi-user text-[9px]"></i> {{ cls.professor }}</span>
                <span class="flex items-center gap-1"><i class="pi pi-map-marker text-[9px]"></i> {{ cls.room }}</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  `
})
export class MyScheduleComponent implements OnInit {
  isDarkMode = signal(false);
  activeView: string = 'table';
  selectedTerm: string = '2024-2025 2nd Term';

  viewOptions = [
    { label: 'Table', value: 'table', icon: 'pi pi-table' },
    { label: 'List', value: 'list', icon: 'pi pi-list' }
  ];

  terms = [
    { label: '2024-2025 2nd Term Tertiary', value: '2024-2025 2nd Term' },
    { label: '2024-2025 1st Term Tertiary', value: '2024-2025 1st Term' }
  ];

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  timeSlots = [
    "7:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM"
  ];

  stats = [
    { label: 'Weekly Hours', value: '12', icon: 'pi pi-clock', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
    { label: 'Total Subjects', value: '7', icon: 'pi pi-book', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
    { label: 'Classrooms', value: '6', icon: 'pi pi-map-marker', color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' }
  ];

  scheduleByDay: { [key: string]: ScheduleEntry[] } = {
    Monday: [
      { subject: "Mobile System and Tech", day: ["Monday"], time: "7:00 AM - 9:00 AM", room: "LIB2", professor: "J. BERNABE", color: '#3b82f6' },
      { subject: "Web Systems & Tech", day: ["Monday"], time: "10:00 AM - 1:00 PM", room: "L3", professor: "E. ENERLAN", color: '#8b5cf6' },
      { subject: "Information Assurance", day: ["Monday"], time: "2:00 PM - 5:00 PM", room: "212", professor: "J. GUEVARRA", color: '#ec4899' }
    ],
    Tuesday: [
      { subject: "Great Books", day: ["Tuesday", "Thursday"], time: "7:00 AM - 8:30 AM", room: "218-A", professor: "L. MANALAYSAY", color: '#f59e0b' },
      { subject: "Management Info Sys", day: ["Tuesday", "Thursday"], time: "8:30 AM - 10:00 AM", room: "218-A", professor: "E. ENERLAN", color: '#10b981' }
    ],
    Wednesday: [],
    Thursday: [
      { subject: "Great Books", day: ["Tuesday", "Thursday"], time: "7:00 AM - 8:30 AM", room: "218-A", professor: "L. MANALAYSAY", color: '#f59e0b' },
      { subject: "Management Info Sys", day: ["Tuesday", "Thursday"], time: "8:30 AM - 10:00 AM", room: "218-A", professor: "E. ENERLAN", color: '#10b981' }
    ],
    Friday: [
      { subject: "Mobile Systems", day: ["Friday"], time: "10:00 AM - 1:00 PM", room: "L1", professor: "J. BERNABE", color: '#3b82f6' },
      { subject: "IT Capstone Project 1", day: ["Friday"], time: "3:00 PM - 5:00 PM", room: "212", professor: "R. CAMPOSAGRADO", color: '#ef4444' }
    ],
    Saturday: [
      { subject: "Programming Languages", day: ["Saturday"], time: "10:00 AM - 1:00 PM", room: "206", professor: "J. BERNABE", color: '#6366f1' },
      { subject: "Web Systems and Tech", day: ["Saturday"], time: "1:00 PM - 3:00 PM", room: "206", professor: "E. ENERLAN", color: '#8b5cf6' }
    ]
  };

  constructor() {
    effect(() => {
      this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }

  getClassesForSlot(day: string, slot: string): ScheduleEntry[] {
    return this.scheduleByDay[day].filter(cls => {
      const classStart = cls.time.split(' - ')[0];
      return slot.startsWith(classStart);
    });
  }
}