import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Class Schedule</h1>
          <p class="text-gray-500 dark:text-slate-400">{{ todayDate }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
        <div class="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-400 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
          </svg>
          Filter Schedule
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Search by Subject</label>
            <input type="text" [(ngModel)]="searchSubject" placeholder="Enter subject name" 
              class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Filter by Year</label>
            <select [(ngModel)]="filterYear" class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none">
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Filter by Day</label>
            <select [(ngModel)]="filterDay" class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none">
              <option value="">All Days</option>
              <option *ngFor="let day of weekDays" [value]="day">{{ day }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Filter by Section</label>
            <input type="text" [(ngModel)]="filterSection" placeholder="e.g. BSIT 2A" 
              class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none">
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div class="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-700 dark:text-gray-200">Weekly Overview (Mon-Sat)</h3>
          <span class="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            {{ filteredClasses.length }} Classes Found
          </span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 text-xs uppercase font-bold">
                <th class="p-4 border-b dark:border-slate-800">Day</th>
                <th class="p-4 border-b dark:border-slate-800">Time</th>
                <th class="p-4 border-b dark:border-slate-800">Subject</th>
                <th class="p-4 border-b dark:border-slate-800">Section</th>
                <th class="p-4 border-b dark:border-slate-800">Room</th>
                <th class="p-4 border-b dark:border-slate-800 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              <tr *ngFor="let item of filteredClasses" class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                <td class="p-4 font-bold text-gray-700 dark:text-gray-300">{{ item.day }}</td>
                <td class="p-4 text-blue-600 dark:text-blue-400 font-medium">{{ item.time }}</td>
                <td class="p-4">
                  <div class="font-semibold text-gray-800 dark:text-gray-100">{{ item.subject }}</div>
                  <div class="text-xs text-gray-400 dark:text-slate-500">{{ item.year }}</div>
                </td>
                <td class="p-4 text-gray-600 dark:text-slate-400">{{ item.section }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 bg-gray-100 dark:bg-slate-800 dark:text-slate-300 rounded text-xs font-mono border dark:border-slate-700">{{ item.room }}</span>
                </td>
                <td class="p-4 text-center">
                  <button (click)="viewAttendance(item)" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95">
                    View Attendance
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="currentClass" class="animate-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
        
        <div class="p-4 bg-slate-800 dark:bg-slate-950 text-white flex flex-wrap justify-between items-center gap-4">
          <div>
            <span class="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Attendance Management</span>
            <h3 class="font-bold text-lg leading-tight">{{ currentClass.subject }} — {{ currentClass.section }}</h3>
          </div>
          
          <div class="flex items-center gap-2">
            <button (click)="saveAttendance()" 
              class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95">
              <i class="fas fa-save"></i> Save
            </button>
            <button (click)="exportToCSV()" 
              class="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95">
              <i class="fas fa-file-csv"></i> CSV
            </button>
            <button (click)="exportToExcel()" 
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95">
              <i class="fas fa-file-excel"></i> Excel
            </button>
          </div>
        </div>

        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">
            <tr>
              <th class="p-4">Student ID</th>
              <th class="p-4">Student Name</th>
              <th class="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
            <tr *ngFor="let student of filteredStudents" class="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="p-4 font-mono text-sm text-blue-600 dark:text-blue-400 font-semibold">{{ student.id }}</td>
              <td class="p-4 font-semibold text-gray-700 dark:text-gray-200">{{ student.name }}</td>
              <td class="p-4">
                <div class="flex justify-center">
                  <select [(ngModel)]="student.status" 
                    [ngClass]="{
                      'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50': student.status === 'Present',
                      'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50': student.status === 'Late',
                      'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50': student.status === 'Absent'
                    }"
                    class="border rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer min-w-[100px] dark:bg-slate-800">
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TeacherScheduleComponent implements OnInit {
  todayDate = "Monday, September 11, 2023";
  currentClass: any = null;

  searchSubject: string = '';
  filterYear: string = '';
  filterDay: string = '';
  filterSection: string = '';

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  classes = [
    { id: 0, day: "Monday", time: "08:00 - 10:00", subject: "Database Management", year: "1st Year", section: "BSIT 2A", room: "Room 204" },
    { id: 1, day: "Tuesday", time: "10:00 - 12:00", subject: "Network Administration", year: "1st Year", section: "BSIT 3B", room: "Room 305" },
    { id: 2, day: "Wednesday", time: "01:00 - 02:30", subject: "Programming", year: "2nd Year", section: "BSCS 1C", room: "Lab 102" },
    { id: 3, day: "Thursday", time: "09:00 - 11:00", subject: "Web Development", year: "3rd Year", section: "BSIT 3A", room: "Lab 105" },
    { id: 4, day: "Friday", time: "02:00 - 04:00", subject: "Ethics in IT", year: "1st Year", section: "BSIT 1B", room: "Room 501" },
    { id: 5, day: "Saturday", time: "08:00 - 12:00", subject: "Capstone Project 1", year: "3rd Year", section: "BSIT 4A", room: "Research Center" }
  ];

  students = [
    { id: '02000291930', name: 'Juan Dela Cruz', section: 'BSIT 2A', status: 'Present' },
    { id: '02000302931', name: 'Maria Santos', section: 'BSIT 2A', status: 'Present' },
    { id: '02000413932', name: 'Pedro Gomez', section: 'BSIT 3B', status: 'Late' },
    { id: '02000867938', name: 'Ana Cruz', section: 'BSCS 1C', status: 'Present' },
    { id: '02000129995', name: 'John Smith', section: 'BSIT 3A', status: 'Present' }
  ];

  ngOnInit() {}

  get filteredClasses() {
    return this.classes.filter(item => {
      const matchSubject = item.subject.toLowerCase().includes(this.searchSubject.toLowerCase());
      const matchYear = this.filterYear ? item.year === this.filterYear : true;
      const matchDay = this.filterDay ? item.day === this.filterDay : true;
      const matchSection = item.section.toLowerCase().includes(this.filterSection.toLowerCase());
      return matchSubject && matchYear && matchDay && matchSection;
    });
  }

  get filteredStudents() {
    return this.students.filter(s => s.section === this.currentClass?.section);
  }

  viewAttendance(item: any) {
    this.currentClass = item;
  }

  saveAttendance() {
    alert(`Attendance for ${this.currentClass.subject} (${this.currentClass.section}) has been saved successfully!`);
  }

  exportToCSV() {
    const data = this.filteredStudents;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student ID,Name,Status\n"
      + data.map(s => `${s.id},${s.name},${s.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${this.currentClass.section}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToExcel() {
    alert(`Exporting ${this.currentClass.subject} attendance to Excel...`);
    this.exportToCSV(); 
  }
}