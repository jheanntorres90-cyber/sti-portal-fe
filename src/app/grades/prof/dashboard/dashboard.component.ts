import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatCard = {
  label: string;
  value: string;
  icon: string;          // PrimeIcons class
  bgColor: string;       // Tailwind bg
  darkBg: string;        // Tailwind dark bg
  iconColor: string;     // Tailwind text color (including dark)
};

@Component({
  selector: 'app-grades-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-8 space-y-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
            Grade Portal Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ todayDate }}
          </p>
        </div>
      </div>

      <!-- ✅ STATS (same sizing/style as AttendanceDashboard cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          *ngFor="let stat of stats"
          class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {{ stat.label }}
              </p>
              <p class="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {{ stat.value }}
              </p>
            </div>

            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              [ngClass]="[stat.bgColor, stat.darkBg]"
            >
              <i class="text-xl" [ngClass]="[stat.icon, stat.iconColor]"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Schedule -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  Today's Class Schedule
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upcoming sessions for today
                </p>
              </div>

              <button
                type="button"
                class="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Full Schedule
              </button>
            </div>

            <div class="p-6 space-y-4">
              <div
                *ngFor="let item of schedule"
                class="group flex items-center gap-5 p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl hover:border-blue-500/40 transition-all"
              >
                <div
                  class="min-w-[110px] rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-3 py-2 text-center group-hover:bg-blue-600 group-hover:text-white transition-all"
                >
                  <div class="text-[10px] font-semibold opacity-70">Starts</div>
                  <div class="text-base font-bold">{{ item.time.split('-')[0].trim() }}</div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="font-bold text-gray-800 dark:text-white truncate">
                    {{ item.course }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span class="inline-flex items-center">
                      <i class="pi pi-users mr-2 text-blue-500"></i>{{ item.section }}
                    </span>
                    <span class="inline-flex items-center">
                      <i class="pi pi-map-marker mr-2 text-blue-500"></i>{{ item.room }}
                    </span>
                  </div>
                </div>

                <i class="pi pi-chevron-right text-gray-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column (optional placeholder) -->
        <div class="space-y-8">
          <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Announcements</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest updates</p>

            <div class="mt-5 space-y-4">
              <div
                *ngFor="let a of announcements"
                class="p-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40"
              >
                <p class="font-semibold text-gray-800 dark:text-white">{{ a.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ a.time }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{{ a.content }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2{
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }
  `]
})
export class GradesDashboardComponent implements OnInit {
  todayDate = '';

  // ✅ same “attendance-style” card sizing
  stats: StatCard[] = [
    {
      label: 'Active Classes',
      value: '5',
      icon: 'pi pi-book',
      bgColor: 'bg-blue-100',
      darkBg: 'dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Students',
      value: '142',
      icon: 'pi pi-users',
      bgColor: 'bg-green-100',
      darkBg: 'dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending Subs',
      value: '3',
      icon: 'pi pi-file-edit',
      bgColor: 'bg-purple-100',
      darkBg: 'dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Announcements',
      value: '8',
      icon: 'pi pi-volume-up',
      bgColor: 'bg-orange-100',
      darkBg: 'dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  schedule = [
    { time: '08:00 - 09:30 AM', course: 'Web Development 101', section: 'Section A', room: 'Room 301' },
    { time: '10:00 - 11:30 AM', course: 'Database Management', section: 'Section B', room: 'Room 205' },
    { time: '01:00 - 02:30 PM', course: 'Programming Fundamentals', section: 'Section C', room: 'Room 402' }
  ];

  announcements = [
    { title: 'Midterm Exam Schedule Released', content: 'Midterm examinations will be held from Oct 15-20. Check your schedule for specific dates.', time: '2 hours ago' },
    { title: 'Grade Submission Deadline', content: 'Please submit all prelim grades by October 10, 2025. Late submissions require approval.', time: '1 day ago' },
    { title: 'Faculty Meeting', content: 'Department meeting scheduled for Oct 8 at 3:00 PM in Conference Room A.', time: '3 days ago' }
  ];

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    this.todayDate = new Date().toLocaleDateString('en-US', options);
  }
}