import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

interface Student {
  id: string;
  name: string;
  year: string;
  section: string;
  timeIn?: string;
  timeOut?: string;
  status: 'Present' | 'Late' | 'Absent';
  selected?: boolean;
}

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, DropdownModule, 
    ButtonModule, TableModule, InputTextModule, TooltipModule,
    ToastModule, TagModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    
    <div class="space-y-6 animate-fadeIn pb-12 px-2">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Attendance Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">{{ todayDate | date:'fullDate' }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-6">
        
        <div class="lg:col-span-4 space-y-6">
          <p-card styleClass="shadow-sm border-none dark:bg-slate-900">
            <h2 class="text-lg font-bold mb-4 flex items-center dark:text-white">
              <i class="pi pi-calendar mr-2 text-blue-500"></i> Attendance Calendar
            </h2>
            
            <div class="calendar-grid">
              <div class="text-center font-bold text-xs text-gray-400 py-2" *ngFor="let day of weekDays">{{day}}</div>
              <div *ngFor="let empty of calendarEmptyCells" class="p-2"></div>
              <div *ngFor="let date of calendarDates" 
                   (click)="selectedDate = date"
                   [ngClass]="{'bg-blue-600 text-white shadow-lg': isSameDate(date, selectedDate), 
                              'hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-gray-300': !isSameDate(date, selectedDate),
                              'border border-blue-400': isToday(date)}"
                   class="p-2 text-center text-sm rounded-lg cursor-pointer transition-all">
                {{ date.getDate() }}
              </div>
            </div>
          </p-card>

          <p-card styleClass="shadow-sm border-none dark:bg-slate-900">
             <h2 class="text-lg font-bold mb-4 dark:text-white">Select Class</h2>
             <div class="flex flex-col gap-4">
                <p-dropdown [options]="courses" [(ngModel)]="selectedCourse" placeholder="Select Course" styleClass="w-full"></p-dropdown>
                <p-dropdown [options]="subjects" [(ngModel)]="selectedSubject" placeholder="Select Subject" styleClass="w-full"></p-dropdown>
                <p-dropdown [options]="sections" [(ngModel)]="selectedSection" placeholder="Select Section" styleClass="w-full"></p-dropdown>
                <button pButton label="Load Student List" icon="pi pi-search" (click)="loadStudents()" class="w-full"></button>
             </div>
          </p-card>
        </div>

        <div class="lg:col-span-8">
          <p-card styleClass="shadow-sm border-none dark:bg-slate-900 min-h-[600px]">
            <div *ngIf="!studentsLoaded" class="flex flex-col items-center justify-center h-[400px] text-gray-400">
               <i class="pi pi-users text-6xl mb-4 opacity-20"></i>
               <p>Please select a class and click "Load Students"</p>
            </div>

            <div *ngIf="studentsLoaded" class="space-y-6">
              <div class="flex flex-wrap justify-between items-center gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                 <div class="flex gap-2">
                    <button pButton label="All Present" (click)="markAll('Present')" class="p-button-success p-button-sm"></button>
                    <button pButton label="All Late" (click)="markAll('Late')" class="p-button-warning p-button-sm"></button>
                    <button pButton label="All Absent" (click)="markAll('Absent')" class="p-button-danger p-button-sm"></button>
                 </div>
                 <span class="p-input-icon-left ml-auto">
                    <i class="pi pi-search"></i>
                    <input pInputText type="text" [(ngModel)]="searchTerm" placeholder="Search students..." class="p-inputtext-sm" />
                 </span>
              </div>

              <p-table [value]="filteredStudents" styleClass="p-datatable-sm" [responsiveLayout]="'scroll'">
                <ng-template pTemplate="header">
                  <tr class="dark:text-gray-300">
                    <th style="width: 4rem"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Time In</th>
                    <th>Status</th>
                    <th class="text-right">Quick Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-student>
                  <tr class="dark:bg-slate-900 dark:text-gray-300">
                    <td><p-tableCheckbox [value]="student"></p-tableCheckbox></td>
                    <td class="text-xs font-mono">{{student.id}}</td>
                    <td class="font-semibold">{{student.name}}</td>
                    <td>
                      <input type="time" [(ngModel)]="student.timeIn" 
                             class="bg-transparent border border-gray-300 dark:border-slate-700 rounded px-1 text-xs">
                    </td>
                    <td>
                      <p-tag [value]="student.status" [severity]="getSeverity(student.status)"></p-tag>
                    </td>
                    <td class="text-right">
                      <div class="flex justify-end gap-1">
                        <button pButton icon="pi pi-check" (click)="markStudent(student, 'Present')" class="p-button-rounded p-button-text p-button-success" pTooltip="Present"></button>
                        <button pButton icon="pi pi-clock" (click)="markStudent(student, 'Late')" class="p-button-rounded p-button-text p-button-warning" pTooltip="Late"></button>
                        <button pButton icon="pi pi-times" (click)="markStudent(student, 'Absent')" class="p-button-rounded p-button-text p-button-danger" pTooltip="Absent"></button>
                      </div>
                    </td>
                  </tr>
                </ng-template>
              </p-table>

              <div class="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                 <button pButton label="Export Excel" icon="pi pi-file-excel" class="p-button-outlined p-button-secondary"></button>
                 <button pButton label="Save Attendance" icon="pi pi-save" (click)="save()" class="p-button-primary shadow-lg"></button>
              </div>
            </div>
          </p-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    :host ::ng-deep .p-dropdown { width: 100%; }
    :host ::ng-deep .p-card { border-radius: 1rem; }
  `]
})
export class TeacherAttendanceComponent implements OnInit {
  todayDate = new Date();
  selectedDate = new Date();
  studentsLoaded = false;
  searchTerm = '';

  // Options
  courses = ['BSIT', 'BSCS', 'BSED', 'BSBA'];
  subjects = ['Database Management', 'Network Administration', 'Web Development', 'Programming'];
  sections = ['Section A', 'Section B', 'Section C'];

  selectedCourse = '';
  selectedSubject = '';
  selectedSection = '';

  // Data
  students: Student[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: Date[] = [];
  calendarEmptyCells: number[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.todayDate.getFullYear();
    const month = this.todayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarEmptyCells = Array(firstDay).fill(0);
    this.calendarDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  }

  loadStudents() {
    if (!this.selectedCourse || !this.selectedSubject) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: 'Please select all class details' });
      return;
    }

    // Sample data load
    this.students = [
      { id: '02000291930', name: 'Juan Dela Cruz', year: '1st', section: 'A', status: 'Present' },
      { id: '02000856935', name: 'Maria Santos', year: '1st', section: 'A', status: 'Present' },
      { id: '02000177937', name: 'Pedro Gomez', year: '1st', section: 'B', status: 'Present' },
      { id: '02000867938', name: 'Ana Cruz', year: '2nd', section: 'B', status: 'Present' },
      { id: '0200012995', name: 'John Smith', year: '2nd', section: 'A', status: 'Present' }
    ];
    this.studentsLoaded = true;
    this.messageService.add({ severity: 'success', summary: 'Loaded', detail: 'Student list updated' });
  }

  get filteredStudents() {
    return this.students.filter(s => s.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  markStudent(student: Student, status: 'Present' | 'Late' | 'Absent') {
    student.status = status;
    if (status !== 'Absent') {
      const now = new Date();
      student.timeIn = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    } else {
      student.timeIn = '';
    }
  }

  markAll(status: 'Present' | 'Late' | 'Absent') {
    this.students.forEach(s => this.markStudent(s, status));
    this.messageService.add({ severity: 'info', summary: 'Bulk Action', detail: `All marked as ${status}` });
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (status === 'Present') return 'success';
    if (status === 'Late') return 'warning';
    if (status === 'Absent') return 'danger';
    return 'info';
  }

  save() {
    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Attendance records stored successfully' });
  }

  // Helper Methods
  isSameDate(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
  }

  isToday(date: Date) {
    return this.isSameDate(date, new Date());
  }
}