import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grades-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-8 space-y-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Grade Portal Dashboard</h1>
          <p class="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-1">{{ todayDate }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" class="bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all">
          <div [class]="stat.bgColor + ' ' + stat.textColor + ' w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm ' + stat.darkBg">
            <i [class]="stat.icon"></i>
          </div>
          <div class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stat.value }}</div>
          <div class="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div class="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
              <h3 class="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">Today's Class Schedule</h3>
              <button class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-700 transition-colors">View Full Schedule</button>
            </div>
            <div class="p-8 space-y-4">
              <div *ngFor="let item of schedule" class="group flex items-center gap-6 p-5 bg-gray-50/50 dark:bg-[#252525] border border-transparent dark:border-white/5 rounded-3xl hover:border-blue-500/50 transition-all cursor-default">
                <div class="flex flex-col items-center justify-center min-w-[100px] py-3 bg-white dark:bg-[#2a2a2a] group-hover:bg-blue-600 group-hover:text-white rounded-2xl transition-all shadow-sm">
                  <span class="text-[9px] font-black uppercase opacity-60">Starts</span>
                  <span class="text-base font-black">{{ item.time.split('-')[0] }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-black text-gray-900 dark:text-gray-100 text-lg uppercase tracking-tight">{{ item.course }}</div>
                  <div class="text-[11px] text-gray-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">
                    <span class="inline-flex items-center mr-4"><i class="pi pi-users mr-2 text-blue-500"></i> {{ item.section }}</span>
                    <span class="inline-flex items-center"><i class="pi pi-map-marker mr-2 text-blue-500"></i> {{ item.room }}</span>
                  </div>
                </div>
                <i class="pi pi-chevron-right text-gray-300 dark:text-slate-700 group-hover:text-blue-400 transition-colors px-2"></i>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <div class="p-8 border-b border-gray-50 dark:border-white/5">
              <h3 class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Grade Submission Reminders</h3>
            </div>
            <div class="p-8 space-y-4">
              <div *ngFor="let reminder of reminders" 
                   class="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#252525] hover:bg-white dark:hover:bg-[#2a2a2a] transition-all">
                <div class="mb-4 md:mb-0">
                  <div class="flex items-center gap-3 mb-2">
                    <span [class]="reminder.type === 'prelim' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'" class="text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                      {{ reminder.term }}
                    </span>
                    <div class="text-base font-black text-gray-900 dark:text-gray-100 uppercase">{{ reminder.course }}</div>
                  </div>
                  <div class="text-[11px] text-gray-500 dark:text-slate-400 font-bold flex items-center uppercase tracking-widest">
                    <i class="pi pi-clock mr-2 text-red-500"></i> Deadline: {{ reminder.dueDate }}
                  </div>
                </div>
                <button class="bg-gray-900 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                  Upload Grade Sheet
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden sticky top-8">
            <div class="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
              <h3 class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Announcements</h3>
              <i class="pi pi-megaphone text-blue-500"></i>
            </div>
            <div class="divide-y divide-gray-50 dark:divide-white/5">
              <div *ngFor="let ann of announcements" class="p-8 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer group">
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-black text-gray-900 dark:text-gray-100 text-sm leading-tight pr-4 uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ ann.title }}</h4>
                  <span *ngIf="ann.isNew" class="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">NEW</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-medium">{{ ann.content }}</p>
                <div class="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center">
                  <i class="pi pi-calendar-plus mr-2"></i> {{ ann.time }}
                </div>
              </div>
            </div>
            <button class="w-full py-6 text-[10px] font-black text-gray-500 dark:text-slate-400 border-t border-gray-50 dark:border-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-[0.3em] bg-gray-50/30 dark:bg-[#1e1e1e]">
              Show All Announcements
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class GradesDashboardComponent implements OnInit {
  todayDate: string = '';

  stats = [
    { label: 'Active Classes', value: '5', icon: 'pi pi-book', bgColor: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', textColor: 'text-blue-600' },
    { label: 'Total Students', value: '142', icon: 'pi pi-users', bgColor: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900/20', textColor: 'text-indigo-600' },
    { label: 'Pending Subs', value: '3', icon: 'pi pi-file-edit', bgColor: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', textColor: 'text-amber-600' },
    { label: 'Announcements', value: '8', icon: 'pi pi-volume-up', bgColor: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20', textColor: 'text-emerald-600' }
  ];

  schedule = [
    { time: '08:00 - 09:30 AM', course: 'Web Development 101', section: 'Section A', room: 'Room 301' },
    { time: '10:00 - 11:30 AM', course: 'Database Management', section: 'Section B', room: 'Room 205' },
    { time: '01:00 - 02:30 PM', course: 'Programming Fundamentals', section: 'Section C', room: 'Room 402' }
  ];

  announcements = [
    { title: 'Midterm Exam Schedule Released', content: 'Midterm examinations will be held from Oct 15-20. Check your schedule for specific dates.', time: '2 hours ago', isNew: true },
    { title: 'Grade Submission Deadline', content: 'Please submit all prelim grades by October 10, 2025. Late submissions require approval.', time: '1 day ago', isNew: false },
    { title: 'Faculty Meeting', content: 'Department meeting scheduled for Oct 8 at 3:00 PM in Conference Room A.', time: '3 days ago', isNew: false }
  ];

  reminders = [
    { course: 'Web Development 101', term: 'Prelims', dueDate: 'Oct 10, 2025', type: 'prelim' },
    { course: 'Database Management', term: 'Midterms', dueDate: 'Oct 15, 2025', type: 'midterm' }
  ];

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.todayDate = new Date().toLocaleDateString('en-US', options);
  }
}