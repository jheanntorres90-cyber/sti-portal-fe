import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
         Student List
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2"> Monitor and manage registered students</p>
    </div>
  </div>
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold flex items-center gap-2 dark:text-white uppercase text-xs tracking-widest text-slate-500">
            <i class="fas fa-filter text-blue-600"></i> Filter System
          </h2>
          <button (click)="clearFilters()" class="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-tighter">
            Reset All
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Student Name</label>
            <input [(ngModel)]="filters.name" (input)="applyFilters()" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2.5 text-sm dark:text-white focus:ring-2 ring-blue-500 transition-all" placeholder="Search...">
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
            <select [(ngModel)]="filters.status" (change)="applyFilters()" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2.5 text-sm dark:text-white focus:ring-2 ring-blue-500 transition-all">
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Subject</label>
            <input [(ngModel)]="filters.subject" (input)="applyFilters()" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2.5 text-sm dark:text-white focus:ring-2 ring-blue-500 transition-all" placeholder="e.g. Database">
          </div>
          <div class="flex items-end pb-0.5">
            <button (click)="exportCSV()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
              <i class="fas fa-file-csv"></i> Export Data
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 dark:bg-slate-950/50 text-[10px] uppercase text-slate-400 font-black border-b dark:border-slate-800">
              <tr>
                <th class="px-6 py-4">Student ID</th>
                <th class="px-6 py-4">Full Name</th>
                <th class="px-6 py-4">Section & Year</th>
                <th class="px-6 py-4">Subject</th>
                <th class="px-6 py-4">Attendance</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800">
              <tr *ngFor="let s of paginatedStudents" class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{{ s.id }}</td>
                <td class="px-6 py-4 font-bold dark:text-white text-sm">{{ s.name }}</td>
                <td class="px-6 py-4">
                   <span class="text-xs dark:text-slate-400 font-medium">{{ s.section }}</span>
                   <span class="block text-[10px] text-slate-400 uppercase font-bold">{{ s.year }}</span>
                </td>
                <td class="px-6 py-4 text-xs dark:text-slate-400 font-medium">{{ s.subject }}</td>
                <td class="px-6 py-4">
                  <select [(ngModel)]="s.status" (change)="updateStatus(s)" 
                    [ngClass]="{
                      'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20': s.status === 'Present',
                      'text-amber-600 bg-amber-50 dark:bg-amber-900/20': s.status === 'Late',
                      'text-rose-600 bg-rose-50 dark:bg-rose-900/20': s.status === 'Absent'
                    }"
                    class="text-[10px] font-black uppercase rounded-lg border-none py-1 pl-2 pr-8 focus:ring-0 cursor-pointer transition-all">
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {{ paginatedStudents.length }} of {{ filteredStudents.length }} Records
          </p>
          <div class="flex gap-2">
            <button (click)="setPage(currentPage - 1)" [disabled]="currentPage === 1" class="px-4 py-2 text-[10px] font-black uppercase bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl disabled:opacity-30 dark:text-white transition-all">Prev</button>
            <button (click)="setPage(currentPage + 1)" [disabled]="currentPage === totalPages" class="px-4 py-2 text-[10px] font-black uppercase bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl disabled:opacity-30 dark:text-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .overflow-x-auto::-webkit-scrollbar { display: none; }
  `]
})
export class StudentListComponent implements OnInit {
  // Filters
  filters = { name: '', year: '', section: '', subject: '', status: '' };
  
  // Data State
  allStudents = [
    { id: '02000291930', name: 'Juan Dela Cruz', year: '1st Year', section: 'BSIT 2A', subject: 'Database Management', status: 'Present' },
    { id: '02000302931', name: 'Maria Santos', year: '1st Year', section: 'BSIT 2A', subject: 'Database Management', status: 'Present' },
    { id: '02000413932', name: 'Pedro Gomez', year: '1st Year', section: 'BSIT 3B', subject: 'Network Administration', status: 'Late' },
    { id: '02000524933', name: 'Ana Cruz', year: '1st Year', section: 'BSIT 3B', subject: 'Network Administration', status: 'Absent' },
    { id: '02000635934', name: 'Luis Reyes', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Present' },
    { id: '02000746935', name: 'Sofia Martinez', year: '2nd Year', section: 'BSCS 1C', subject: 'Programming', status: 'Present' }
  ];

  filteredStudents: any[] = [];
  paginatedStudents: any[] = [];
  
  // Pagination State
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.allStudents.filter(s => 
      s.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
      s.subject.toLowerCase().includes(this.filters.subject.toLowerCase()) &&
      (!this.filters.status || s.status === this.filters.status)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(start, start + this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  clearFilters() {
    this.filters = { name: '', year: '', section: '', subject: '', status: '' };
    this.applyFilters();
  }

  updateStatus(student: any) {
    console.log(`Updated ${student.name} status to ${student.status}`);
  }

  exportCSV() {
    const headers = ['ID', 'Name', 'Year', 'Section', 'Subject', 'Status'];
    const rows = this.filteredStudents.map(s => [s.id, s.name, s.year, s.section, s.subject, s.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}