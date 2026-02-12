import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

interface Term {
  label: string;
  value: string;
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    TagModule, 
    ButtonModule, 
    DropdownModule, 
    TooltipModule
  ],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      
      <main class="max-w-7xl mx-auto w-full space-y-8 animate-fadeIn">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-3xl font-black tracking-tight">Academic Performance</h2>
            <p class="text-slate-500 font-medium italic">Track your progress for each semester</p>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <div class="flex flex-col">
              <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Academic Year</label>
              <p-dropdown 
                [options]="years" 
                [(ngModel)]="selectedYear" 
                placeholder="Select Year"
                styleClass="w-full md:w-48 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              </p-dropdown>
            </div>
            
            <div class="flex flex-col">
              <label class="text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Semester</label>
              <p-dropdown 
                [options]="semesters" 
                [(ngModel)]="selectedSem" 
                placeholder="Select Semester"
                styleClass="w-full md:w-48 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
              </p-dropdown>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div *ngFor="let stat of stats" 
               class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300">
            <div [ngClass]="stat.colorClass" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">
              <i [class]="stat.icon"></i>
            </div>
            <div>
              <p class="text-2xl font-bold leading-none tracking-tighter">{{ stat.value }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngFor="let subject of subjects" 
               class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-lg text-blue-600 dark:text-blue-400 leading-tight">{{ subject.title }}</h4>
              <p-tag [value]="subject.finalGrade" severity="success" class="scale-110"></p-tag>
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              {{ subject.prof }} • {{ subject.date }}
            </p>

            <div class="grid grid-cols-4 gap-2 text-center">
              <div *ngFor="let period of ['Prelim', 'Midterm', 'Pre-Finals', 'Finals']" class="text-[9px] font-black uppercase text-slate-400">
                {{ period }}
              </div>
              <div class="bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg font-bold text-sm">{{ subject.prelim || '-' }}</div>
              <div class="bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg font-bold text-sm">{{ subject.midterm || '-' }}</div>
              <div class="bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg font-bold text-sm">{{ subject.prefinal || '-' }}</div>
              <div class="bg-slate-50 dark:bg-slate-800/50 py-2 rounded-lg font-bold text-sm">{{ subject.finals || '-' }}</div>
            </div>

            <div class="mt-6 pt-4 border-t dark:border-slate-800 flex justify-between items-center">
              <span class="text-xs font-bold text-slate-500 italic">Numerical Equiv.</span>
              <button class="text-[11px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-500/20">Final Grade: {{ subject.finalGrade }}</button>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div class="p-6 border-b dark:border-slate-800 flex items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 class="font-bold tracking-tight flex items-center gap-2">
              <i class="pi pi-info-circle text-blue-500"></i> Grading System
            </h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div *ngFor="let item of gradingSystem" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-transparent text-[11px] font-bold">
                <span class="text-yellow-500 mr-2">☆</span>{{ item }}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class GradesComponent implements OnInit {
  isDarkMode = signal(false);

  // Dropdown Options
  selectedYear: string = '2024-2025';
  selectedSem: string = '2nd Semester';

  years: Term[] = [
    { label: 'A.Y. 2024-2025', value: '2024-2025' },
    { label: 'A.Y. 2023-2024', value: '2023-2024' }
  ];

  semesters: Term[] = [
    { label: '1st Semester', value: '1st Semester' },
    { label: '2nd Semester', value: '2nd Semester' }
  ];

  stats = [
    { label: 'Term GPA', value: '2.25', icon: 'pi pi-chart-bar', colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
    { label: 'Term Credits', value: '21.0', icon: 'pi pi-book', colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
    { label: 'Academic Standing', value: 'Regular', icon: 'pi pi-user', colorClass: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' }
  ];

  subjects = [
    { title: "Great Books", prof: "L. MANALAYSAY", date: "17 JUN, 2025", prelim: "82.00", midterm: "82.67", prefinal: "90.67", finals: "89.33", finalGrade: "2.00" },
    { title: "Information Assurance & Security", prof: "J. GUEVARRA", date: "16 JUN, 2025", prelim: "89.00", midterm: "66.15", prefinal: "87.20", finals: "80.00", finalGrade: "2.50" },
    { title: "IT Capstone Project 1", prof: "R. CAMPOSAGRADO", date: "16 JUN, 2025", prelim: "92.00", midterm: "88.00", prefinal: "85.00", finals: "87.20", finalGrade: "2.00" },
    { title: "Web Systems and Technologies", prof: "E. ENERLAN", date: "16 JUN, 2025", prelim: "72.67", midterm: "77.42", prefinal: "86.00", finals: "91.33", finalGrade: "2.25" }
  ];

  gradingSystem = [
    "1.00 (97.5-100%) Excellent",
    "1.25 (94.5-97.49%) Very Good",
    "1.50 (91.5-94.49%) Very Good",
    "1.75 (88.5-91.49%) Very Good",
    "2.00 (85.5-88.49%) Satisfactory",
    "2.25 (81.5-85.49%) Satisfactory",
    "2.50 (77.5-81.49%) Satisfactory",
    "2.75 (73.5-77.49%) Fair",
    "3.00 (69.5-73.49%) Fair",
    "5.00 (Below 69.5%) Failed",
    "DRP (Officially Dropped)",
    "INC (Incomplete Req.)"
  ];

  constructor() {
    effect(() => {
      const theme = localStorage.getItem('theme');
      this.isDarkMode.set(theme === 'dark');
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }
}