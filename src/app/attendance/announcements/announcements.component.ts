import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Announcement {
  id: number;
  audience: string;
  course: string;
  subject: string;
  message: string;
  imageName: string;
  date: string;
}

@Component({
  selector: 'app-teacher-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
          <p class="text-gray-500 dark:text-slate-400">{{ todayDate }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
            <div class="flex items-center gap-2 mb-6 text-blue-800 dark:text-blue-400 font-bold text-lg">
              <i class="fas fa-plus-circle"></i> Create New Announcement
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Audience</label>
                <select [(ngModel)]="newAnnouncement.audience" 
                  class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option value="Students">Students</option>
                  <option value="Teachers">Teachers</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Course (Optional)</label>
                <input type="text" [(ngModel)]="newAnnouncement.course" placeholder="e.g. BSIT" 
                  class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Subject (Optional)</label>
                <input type="text" [(ngModel)]="newAnnouncement.subject" placeholder="Enter subject" 
                  class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Image Attachment</label>
                <input type="file" (change)="handleFileInput($event)" 
                  class="w-full text-xs text-gray-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 transition-all">
              </div>
              <div class="md:col-span-2 space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Message</label>
                <textarea [(ngModel)]="newAnnouncement.message" rows="4" placeholder="Type your message here..." 
                  class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button (click)="postAnnouncement()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                <i class="fas fa-paper-plane"></i> Post Announcement
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
            <div class="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-400 font-bold">
              <i class="fas fa-filter"></i> Filter History
            </div>
            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">By Audience</label>
                <select [(ngModel)]="filterAudience" class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option value="">All Audiences</option>
                  <option value="Students">Students</option>
                  <option value="Teachers">Teachers</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">By Date</label>
                <input type="date" [(ngModel)]="filterDate" class="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              </div>
              <p class="text-[10px] text-gray-400 dark:text-slate-500 italic pt-2 text-center">Auto-syncing history records</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div class="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 class="font-bold text-gray-700 dark:text-gray-200">Announcement History</h3>
          <span class="text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            {{ filteredAnnouncements.length }} Records Found
          </span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 text-xs uppercase font-bold">
                <th class="p-4 border-b dark:border-slate-800">Audience</th>
                <th class="p-4 border-b dark:border-slate-800">Context</th>
                <th class="p-4 border-b dark:border-slate-800 w-1/3">Message</th>
                <th class="p-4 border-b dark:border-slate-800 text-center">Attachment</th>
                <th class="p-4 border-b dark:border-slate-800">Date</th>
                <th class="p-4 border-b dark:border-slate-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              <tr *ngFor="let item of filteredAnnouncements" class="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="p-4">
                  <span [ngClass]="{
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400': item.audience === 'Students',
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400': item.audience === 'Teachers',
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': item.audience === 'All'
                  }" class="px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                    {{ item.audience }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ item.subject }}</div>
                  <div class="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{{ item.course }}</div>
                </td>
                <td class="p-4 text-sm text-gray-600 dark:text-slate-400 truncate max-w-xs" [title]="item.message">
                  {{ item.message }}
                </td>
                <td class="p-4 text-center">
                  <i *ngIf="item.imageName" class="fas fa-paperclip text-blue-500 dark:text-blue-400" [title]="item.imageName"></i>
                  <span *ngIf="!item.imageName" class="text-gray-300 dark:text-slate-700 text-xs">None</span>
                </td>
                <td class="p-4 text-xs font-medium text-gray-500 dark:text-slate-500">{{ item.date }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button (click)="deleteAnnouncement(item.id)" 
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Announcement">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredAnnouncements.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 dark:text-slate-600 italic">No announcements found matching your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TeacherAnnouncementsComponent implements OnInit {
  todayDate = "Monday, September 11, 2023";
  
  announcements: Announcement[] = [
    { id: 1, audience: 'Students', course: 'BSIT 2A', subject: 'Midterm Exam', message: 'Prepare chapters 1-5 for next week.', imageName: 'guide.pdf', date: '2023-09-15' },
    { id: 2, audience: 'Teachers', course: 'N/A', subject: 'Faculty Meeting', message: 'Meeting at 3PM in the conference room.', imageName: '', date: '2023-09-12' },
    { id: 3, audience: 'All', course: 'N/A', subject: 'Holiday Notice', message: 'Closed on Sep 20 for National Holiday.', imageName: 'holiday.jpg', date: '2023-09-08' }
  ];

  newAnnouncement = {
    audience: 'Students',
    course: '',
    subject: '',
    message: '',
    imageName: ''
  };

  filterAudience: string = '';
  filterDate: string = '';

  ngOnInit() {}

  get filteredAnnouncements() {
    return this.announcements.filter(a => {
      const matchAudience = this.filterAudience ? a.audience === this.filterAudience : true;
      const matchDate = this.filterDate ? a.date === this.filterDate : true;
      return matchAudience && matchDate;
    });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) this.newAnnouncement.imageName = file.name;
  }

  postAnnouncement() {
    if (!this.newAnnouncement.message) return alert('Message is required');
    
    const record: Announcement = {
      id: Date.now(),
      audience: this.newAnnouncement.audience,
      course: this.newAnnouncement.course || 'N/A',
      subject: this.newAnnouncement.subject || 'General',
      message: this.newAnnouncement.message,
      imageName: this.newAnnouncement.imageName,
      date: new Date().toISOString().split('T')[0]
    };

    this.announcements.unshift(record);
    this.resetForm();
    alert('Announcement posted successfully!');
  }

  deleteAnnouncement(id: number) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcements = this.announcements.filter(a => a.id !== id);
    }
  }

  resetForm() {
    this.newAnnouncement = { audience: 'Students', course: '', subject: '', message: '', imageName: '' };
  }
}