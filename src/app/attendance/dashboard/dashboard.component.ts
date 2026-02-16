import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface TodayClass {
  subject: string;
  section: string;
  room: string;
  time: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface Announcement {
  title: string;
  meta: string;
  content: string;
}

@Component({
  selector: 'app-attendance-dashboard',
  standalone: true,
  imports: [
    CommonModule, CardModule, ButtonModule, ChartModule, 
    TableModule, TagModule, TooltipModule
  ],
  template: `
    <div class="space-y-10 animate-fadeIn pb-12 px-2">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gray-800 dark:text-white">Attendance Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage student attendance effectively</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Weekly Classes</p>
              <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">12</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <i class="pi pi-calendar text-xl text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Students</p>
              <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">85</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <i class="pi pi-users text-xl text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Today's Classes</p>
              <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">3</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <i class="pi pi-calendar-clock text-xl text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>

        <div class="stat-card bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Attendance Rate</p>
              <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">94%</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <i class="pi pi-chart-line text-xl text-orange-600 dark:text-orange-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 mb-10">
        <p-card styleClass="shadow-sm border-none dark:bg-slate-900 h-full">
          <div class="p-2">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xl font-heading font-semibold text-gray-800 dark:text-white">
                <i class="pi pi-calendar-day mr-2 text-blue-600"></i>
                Today's Classes
              </h2>
            </div>
            
            <div class="overflow-x-auto">
              <p-table [value]="todaysClasses" styleClass="p-datatable-sm">
                <ng-template pTemplate="header">
                  <tr>
                    <th class="dark:bg-slate-800 dark:text-gray-300 border-none rounded-l-lg">Subject</th>
                    <th class="dark:bg-slate-800 dark:text-gray-300 border-none">Section</th>
                    <th class="dark:bg-slate-800 dark:text-gray-300 border-none">Status</th>
                    <th class="dark:bg-slate-800 dark:text-gray-300 border-none rounded-r-lg text-right">Action</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-class>
                  <tr class="dark:text-gray-300">
                    <td class="font-semibold py-4">{{ class.subject }}</td>
                    <td>{{ class.section }}</td>
                    <td>
                      <p-tag [value]="getStatusText(class.status)" 
                             [severity]="getStatusSeverity(class.status)"
                             styleClass="text-[10px] uppercase px-2 py-0.5">
                      </p-tag>
                    </td>
                    <td class="text-right">
                      <button *ngIf="class.status === 'in-progress'" pButton icon="pi pi-check" 
                              class="p-button-rounded p-button-success p-button-text" 
                              pTooltip="Take Attendance" (click)="onAction(class)"></button>
                      <button *ngIf="class.status === 'completed'" pButton icon="pi pi-eye" 
                              class="p-button-rounded p-button-secondary p-button-text" 
                              pTooltip="View Record" (click)="onAction(class)"></button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
        </p-card>

         

        <p-card styleClass="shadow-sm border-none dark:bg-slate-900 h-full">
          <div class="p-2">
            <h2 class="text-xl font-heading font-semibold text-gray-800 dark:text-white mb-8">Weekly Attendance</h2>
            <div class="h-[300px]">
              <p-chart type="bar" [data]="attendanceChartData" [options]="chartOptions" height="100%"></p-chart>
            </div>
          </div>
        </p-card>
      </div>

      <p-card styleClass="shadow-sm border-none dark:bg-slate-900">
        <div class="p-2">
          <div class="flex items-center justify-between mb-8 px-2">
            <h2 class="text-xl font-heading font-semibold text-gray-800 dark:text-white">
              <i class="pi pi-bullhorn mr-2 text-blue-600"></i>
              Latest Announcements
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let announcement of announcements" 
                 class="p-6 border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all">
              <div class="flex items-start justify-between mb-4">
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase">Official</span>
                <span class="text-[10px] text-gray-400">New</span>
              </div>
              <h3 class="font-bold text-gray-800 dark:text-white mb-2 leading-tight">{{ announcement.title }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ announcement.meta }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{{ announcement.content }}</p>
            </div>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .animate-fadeIn {
      animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      background: transparent !important;
      border-color: #1e293b !important;
    }
  `]
})
export class AttendanceDashboardComponent implements OnInit {
  todaysClasses: TodayClass[] = [
    { subject: 'Mathematics', section: 'BSIT 2A', room: 'Room 204', time: '8:00 AM - 9:30 AM', status: 'completed' },
    { subject: 'Science', section: 'BSIT 3B', room: 'Room 305', time: '10:00 AM - 11:30 AM', status: 'in-progress' },
    { subject: 'Programming', section: 'BSCS 1C', room: 'Lab 102', time: '1:00 PM - 2:30 PM', status: 'upcoming' },
  ];

  announcements: Announcement[] = [
    { title: 'General Assembly - September 15', meta: 'Posted by Administration • Sep 10, 2023', content: 'All faculty members are required to attend.' },
    { title: 'Class Suspension - Typhoon Alert', meta: 'Posted by Administration • Sep 9, 2023', content: 'Classes on Sept 18 suspended due to weather.' },
    { title: 'New Curriculum Guidelines', meta: 'Posted by Academic Department • Sep 5, 2023', content: 'Please review the updated guidelines.' }
  ];

  attendanceChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'Present', backgroundColor: '#10B981', borderRadius: 6, data: [45, 43, 47, 46, 44] },
      { label: 'Absent', backgroundColor: '#EF4444', borderRadius: 6, data: [5, 7, 3, 4, 6] }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8', stepSize: 10 } }
    }
  };

  ngOnInit() {
    this.updateClassStatuses();
  }

  getStatusText(status: string) {
    const map: any = { 'completed': 'Completed', 'in-progress': 'In Progress', 'upcoming': 'Upcoming' };
    return map[status] || status;
  }

  getStatusSeverity(status: string) {
    const map: any = { 'completed': 'success', 'in-progress': 'warning', 'upcoming': 'info' };
    return map[status] || 'info';
  }

  updateClassStatuses() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    this.todaysClasses.forEach(cls => {
      const [startTime, endTime] = cls.time.split(' - ');
      const start = this.timeToMinutes(startTime);
      const end = this.timeToMinutes(endTime);
      if (currentTime >= start && currentTime <= end) cls.status = 'in-progress';
      else if (currentTime > end) cls.status = 'completed';
      else cls.status = 'upcoming';
    });
  }

  timeToMinutes(timeStr: string) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  onAction(cls: TodayClass) {
    console.log('Action performed for:', cls.subject);
  }
}