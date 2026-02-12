import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  course: string;
  section: string;
  email: string;
  year: string;
  program: string;
  status: 'active' | 'inactive';
  prelim: number;
  midterm: number;
  prefinal: number;
  final: number;
}

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 animate-in fade-in duration-500 bg-gray-50 dark:bg-slate-950 min-h-screen">
      
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">My Students</h1>
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Classroom Management & Academic Tracking</p>
        </div>
        
        <div class="flex bg-gray-200 dark:bg-[#1e1e1e] p-1 rounded-2xl w-fit border border-transparent dark:border-white/5">
          <button (click)="viewMode = 'grid'" 
                  [class.bg-white]="viewMode === 'grid'" 
                  [class.dark:bg-[#2a2a2a]]="viewMode === 'grid'"
                  [class.shadow-sm]="viewMode === 'grid'"
                  [class.text-blue-600]="viewMode === 'grid'"
                  class="px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 dark:text-gray-300 uppercase">
            <i class="fas fa-th"></i> Grid
          </button>
          <button (click)="viewMode = 'table'" 
                  [class.bg-white]="viewMode === 'table'" 
                  [class.dark:bg-[#2a2a2a]]="viewMode === 'table'"
                  [class.shadow-sm]="viewMode === 'table'"
                  [class.text-blue-600]="viewMode === 'table'"
                  class="px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 dark:text-gray-300 uppercase">
            <i class="fas fa-list"></i> Table
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        
        <div class="p-6 border-b dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-4">
            <select [(ngModel)]="courseFilter" 
                    class="bg-gray-50 dark:bg-[#2a2a2a] dark:text-white border-none rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer uppercase tracking-wider transition-all">
              <option value="all">All Courses</option>
              <option *ngFor="let c of courses" [value]="c">{{c}}</option>
            </select>

            <div class="relative">
              <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name or ID..." 
                     class="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#2a2a2a] dark:text-white border-none rounded-xl text-xs w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
            </div>
          </div>
        </div>

        <div class="p-6">
          <div *ngIf="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div *ngFor="let student of filteredStudents" 
                 (click)="openProfile(student)"
                 class="group bg-gray-50 dark:bg-[#252525] border border-transparent hover:border-blue-500/50 rounded-[2rem] p-6 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden">
              
              <div class="flex items-center gap-4 mb-5">
                <div class="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
                  {{ getInitials(student.name) }}
                </div>
                <div class="min-w-0">
                  <div class="font-black text-slate-800 dark:text-white truncate text-sm uppercase tracking-tight">{{student.name}}</div>
                  <div class="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-mono tracking-tighter">{{student.id}}</div>
                </div>
              </div>

              <div class="space-y-3 mb-6 border-t dark:border-white/5 pt-5">
                <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-3 uppercase tracking-wider">
                  <i class="fas fa-book text-blue-500 w-3 text-center"></i> {{student.course}} • {{student.section}}
                </div>
                <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-3 uppercase tracking-wider">
                  <i class="fas fa-graduation-cap text-blue-500 w-3 text-center"></i> {{student.program}} - {{student.year}}
                </div>
              </div>

              <button class="w-full py-3 bg-white dark:bg-[#333] text-blue-600 dark:text-white border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                View Details
              </button>
            </div>
          </div>

          <div *ngIf="viewMode === 'table'" class="overflow-x-auto">
            <table class="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                  <th class="px-6 py-2">Student ID</th>
                  <th class="px-6 py-2">Full Name</th>
                  <th class="px-6 py-2">Course Info</th>
                  <th class="px-6 py-2">Email</th>
                  <th class="px-6 py-2 text-center">GWA</th>
                </tr>
              </thead>
              <tbody class="text-xs">
                <tr *ngFor="let student of filteredStudents" 
                    (click)="openProfile(student)"
                    class="bg-gray-50 dark:bg-[#252525] hover:bg-white dark:hover:bg-[#2d2d2d] border-y border-transparent hover:shadow-md transition-all cursor-pointer group">
                  <td class="py-5 px-6 font-mono font-bold text-blue-600 dark:text-blue-400 first:rounded-l-2xl">{{student.id}}</td>
                  <td class="py-5 px-6 font-black text-slate-800 dark:text-white uppercase tracking-tight">{{student.name}}</td>
                  <td class="py-5 px-6 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{student.course}} • {{student.section}}</td>
                  <td class="py-5 px-6 font-medium text-slate-500 dark:text-slate-400 lowercase">{{student.email}}</td>
                  <td class="py-5 px-6 text-center last:rounded-r-2xl">
                    <span class="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-black text-[10px]">
                      {{ calculateAvg(student) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="filteredStudents.length === 0" class="py-32 text-center">
            <div class="w-20 h-20 bg-slate-100 dark:bg-[#2a2a2a] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
               <i class="fas fa-search text-2xl text-slate-300"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">No student records found</p>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="selectedStudent" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div class="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl scale-in-center border border-transparent dark:border-white/5">
        <div class="p-10">
          <div class="flex justify-between items-start mb-8">
            <div class="h-24 w-24 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-500/20">
              {{ getInitials(selectedStudent.name) }}
            </div>
            <button (click)="selectedStudent = null" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#2a2a2a] text-slate-400 hover:text-rose-500 transition-colors">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
          
          <h2 class="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{{selectedStudent.name}}</h2>
          <p class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-10">{{selectedStudent.id}} • {{selectedStudent.program}}</p>
          
          <div class="grid grid-cols-2 gap-4 mb-10">
            <div class="bg-slate-50 dark:bg-[#2a2a2a] p-5 rounded-[1.5rem] border border-transparent dark:border-white/5">
              <div class="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-[0.1em]">General Average</div>
              <div class="text-2xl font-black text-green-600">{{ calculateAvg(selectedStudent) }}%</div>
            </div>
            <div class="bg-slate-50 dark:bg-[#2a2a2a] p-5 rounded-[1.5rem] border border-transparent dark:border-white/5">
              <div class="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-[0.1em]">Year Level</div>
              <div class="text-2xl font-black text-blue-600 dark:text-blue-400">{{selectedStudent.year}}</div>
            </div>
          </div>

          <div class="space-y-4">
            <button class="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">View Full Portfolio</button>
            <button (click)="selectedStudent = null" class="w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] py-2">Close Preview</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scale-in-center {
      animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }
    @keyframes scale-in-center {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class MyStudentsComponent implements OnInit {
  viewMode: 'grid' | 'table' = 'grid';
  searchQuery = '';
  courseFilter = 'all';
  selectedStudent: Student | null = null;

  courses = ['WEB101', 'DB201', 'PROG101', 'NET301'];
  
  students: Student[] = [
    { id: '2024-001234', name: 'Maria Santos', course: 'WEB101', section: 'A', email: 'maria.santos@sti.edu', year: '2nd Year', program: 'BSIT', status: 'active', prelim: 88, midterm: 90, prefinal: 87, final: 89 },
    { id: '2024-001235', name: 'Juan Dela Cruz', course: 'WEB101', section: 'A', email: 'juan.delacruz@sti.edu', year: '2nd Year', program: 'BSIT', status: 'active', prelim: 85, midterm: 83, prefinal: 86, final: 88 },
    { id: '2024-001236', name: 'Anna Reyes', course: 'DB201', section: 'B', email: 'anna.reyes@sti.edu', year: '3rd Year', program: 'BSCS', status: 'active', prelim: 92, midterm: 94, prefinal: 93, final: 95 },
    { id: '2024-001238', name: 'Sofia Martinez', course: 'PROG101', section: 'C', email: 'sofia.martinez@sti.edu', year: '1st Year', program: 'BSIT', status: 'active', prelim: 90, midterm: 88, prefinal: 91, final: 92 },
  ];

  get filteredStudents() {
    return this.students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || s.id.includes(this.searchQuery);
      const matchCourse = this.courseFilter === 'all' || s.course === this.courseFilter;
      return matchSearch && matchCourse;
    });
  }

  ngOnInit() {}

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('');
  }

  calculateAvg(s: Student) {
    return ((s.prelim + s.midterm + s.prefinal + s.final) / 4).toFixed(1);
  }

  openProfile(s: Student) {
    this.selectedStudent = s;
  }
}