import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudentGrade {
  id: string;
  name: string;
  course: string;
  section: string;
  year: string;
  grades: {
    prelim: number;
    midterm: number;
    prefinal: number;
    final: number;
  };
  status: 'passed' | 'conditional' | 'failed';
}

@Component({
  selector: 'app-view-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">View Student Grades</h1>
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Academic Performance Monitor</p>
      </div>

      <div class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-r-2xl">
        <i class="fas fa-info-circle text-blue-600 mt-1"></i>
        <div>
          <p class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">Grade Viewing Features</p>
          <p class="text-xs text-blue-800 dark:text-blue-400/80">
            Filter grades by course, section, and grading period. View detailed analytics and export reports.
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 mb-6 text-blue-600 font-black uppercase text-xs tracking-widest">
          <i class="fas fa-filter"></i> Filter System
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Academic Year</label>
            <select class="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
              <option>2023-2024</option>
              <option>2022-2023</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Course</label>
            <select [(ngModel)]="courseFilter" (change)="applyFilters()" class="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
              <option value="all">All Courses</option>
              <option *ngFor="let c of courses" [value]="c">{{c}}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Search Student</label>
            <input type="text" [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="Name or ID..."
                   class="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button (click)="applyFilters()" class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            Apply Filters
          </button>
          <button (click)="resetFilters()" class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Reset
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-600">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Records</div>
          <div class="text-3xl font-black text-slate-800 dark:text-white">{{ filteredData.length }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-t-4 border-t-emerald-500">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Passed</div>
          <div class="text-3xl font-black text-emerald-500">{{ getCount('passed') }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-t-4 border-t-amber-500">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Conditional</div>
          <div class="text-3xl font-black text-amber-500">{{ getCount('conditional') }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-t-4 border-t-rose-500">
          <div class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Failed</div>
          <div class="text-3xl font-black text-rose-500">{{ getCount('failed') }}</div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <h2 class="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Student Grade List</h2>
          <div class="flex gap-2">
            <button class="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"><i class="fas fa-file-pdf"></i></button>
            <button class="w-10 h-10 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><i class="fas fa-file-excel"></i></button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-transparent border-b dark:border-slate-800">
                <th class="px-6 py-4 font-black">Student Details</th>
                <th class="px-6 py-4 font-black text-center">Prelim</th>
                <th class="px-6 py-4 font-black text-center">Midterm</th>
                <th class="px-6 py-4 font-black text-center">Pre-Final</th>
                <th class="px-6 py-4 font-black text-center">Final</th>
                <th class="px-6 py-4 font-black text-center">Average</th>
                <th class="px-6 py-4 font-black">Status</th>
                <th class="px-6 py-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800">
              <tr *ngFor="let student of filteredData" class="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-800 dark:text-white text-sm">{{student.name}}</div>
                  <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">{{student.id}} • {{student.course}}</div>
                </td>
                <td class="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 text-sm">{{student.grades.prelim}}</td>
                <td class="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 text-sm">{{student.grades.midterm}}</td>
                <td class="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 text-sm">{{student.grades.prefinal}}</td>
                <td class="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 text-sm">{{student.grades.final}}</td>
                <td class="px-6 py-4 text-center">
                  <span class="text-sm font-black text-blue-600 dark:text-blue-400">{{ calculateAvg(student) }}%</span>
                </td>
                <td class="px-6 py-4">
                  <span [ngClass]="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400': student.status === 'passed',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': student.status === 'conditional',
                    'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400': student.status === 'failed'
                  }" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {{student.status}}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .overflow-x-auto::-webkit-scrollbar { display: none; }
  `]
})
export class ViewGradesComponent implements OnInit {
  searchQuery = '';
  courseFilter = 'all';
  courses = ['WEB101', 'DB201', 'PROG101', 'NET301'];

  gradeData: StudentGrade[] = [
    { id: '2024-001234', name: 'Maria Santos', course: 'WEB101', section: 'A', year: '2023-2024', grades: { prelim: 85, midterm: 88, prefinal: 90, final: 92 }, status: 'passed' },
    { id: '2024-001235', name: 'Juan Dela Cruz', course: 'WEB101', section: 'A', year: '2023-2024', grades: { prelim: 78, midterm: 82, prefinal: 85, final: 87 }, status: 'passed' },
    { id: '2024-001236', name: 'Anna Reyes', course: 'DB201', section: 'B', year: '2023-2024', grades: { prelim: 92, midterm: 90, prefinal: 94, final: 91 }, status: 'passed' },
    { id: '2024-001237', name: 'Pedro Garcia', course: 'DB201', section: 'B', year: '2023-2024', grades: { prelim: 65, midterm: 68, prefinal: 72, final: 70 }, status: 'conditional' },
    { id: '2024-001239', name: 'Miguel Torres', course: 'PROG101', section: 'C', year: '2023-2024', grades: { prelim: 55, midterm: 58, prefinal: 62, final: 60 }, status: 'failed' }
  ];

  filteredData: StudentGrade[] = [];

  ngOnInit() {
    this.filteredData = [...this.gradeData];
  }

  applyFilters() {
    this.filteredData = this.gradeData.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || s.id.includes(this.searchQuery);
      const matchCourse = this.courseFilter === 'all' || s.course === this.courseFilter;
      return matchSearch && matchCourse;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.courseFilter = 'all';
    this.filteredData = [...this.gradeData];
  }

  calculateAvg(s: StudentGrade) {
    const g = s.grades;
    return ((g.prelim + g.midterm + g.prefinal + g.final) / 4).toFixed(1);
  }

  getCount(status: string) {
    return this.filteredData.filter(s => s.status === status).length;
  }
}