import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Announcement {
  title: string;
  type: 'General' | 'Subject' | 'Event' | 'Holiday';
  subject: string;
  content: string;
  image?: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
          <p class="text-gray-500 dark:text-slate-400">Stay updated with campus news and academic alerts</p>
        </div>
        <div class="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
          <i class="fas fa-bell"></i>
          <span>3 New Updates</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</label>
            <select [(ngModel)]="filterType" class="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="All">All Types</option>
              <option value="General">General</option>
              <option value="Subject">Subject-Specific</option>
              <option value="Event">Events</option>
              <option value="Holiday">Holidays</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</label>
            <select [(ngModel)]="filterSubject" class="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="All">All Subjects</option>
              <option *ngFor="let s of subjects" [value]="s">{{s}}</option>
            </select>
          </div>

          <div class="md:col-span-2 space-y-1">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Keywords</label>
            <div class="relative">
              <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" [(ngModel)]="searchQuery" placeholder="Search announcements..." 
                class="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm pl-11 p-3 focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of filteredAnnouncements()" 
          class="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          
          <div class="h-40 overflow-hidden relative">
            <img [src]="item.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 left-4 flex gap-2">
              <span [class]="getTypeClass(item.type)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                {{item.type}}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <span *ngIf="item.priority === 'high'" class="flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-gray-800 dark:text-white line-clamp-1">{{item.title}}</h3>
            </div>
            
            <p class="text-sm text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {{item.content}}
            </p>

            <div class="pt-4 border-t dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <i class="fas fa-calendar-alt"></i>
                {{ formatDate(item.date) }}
              </div>
              <div *ngIf="item.subject" class="text-[10px] font-black text-blue-500 uppercase">
                {{item.subject}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredAnnouncements().length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-4">
          <i class="fas fa-inbox fa-3x text-gray-300"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">No announcements found</h3>
        <p class="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
      </div>
    </div>
  `
})
export class StudentAnnouncementsComponent implements OnInit {
  searchQuery = '';
  filterType = 'All';
  filterSubject = 'All';

  subjects = ['Math', 'Science', 'English', 'Web Development', 'Database Management', 'Programming Fundamentals', 'Network Administration'];

  announcements = signal<Announcement[]>([
    {
      title: "Campus Cleaning Drive",
      type: "General",
      subject: "",
      content: "Join us for the campus clean-up on Sept 25. All students are required to participate in this community service activity.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
      date: "2025-09-20",
      priority: "high"
    },
    {
      title: "Math Quiz Reminder",
      type: "Subject",
      subject: "Math",
      content: "Quiz #2 will be on Sept 22. Please review chapters 3 and 4. The quiz will cover algebraic expressions and basic equations.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
      date: "2025-09-19",
      priority: "high"
    },
    {
      title: "Web Development Project",
      type: "Subject",
      subject: "Web Development",
      content: "Final project submissions are due next Monday. Make sure to test all functionality before submitting.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600",
      date: "2025-09-14",
      priority: "medium"
    },
    {
      title: "Independence Day Holiday",
      type: "Holiday",
      subject: "",
      content: "Classes will be suspended in observance of Independence Day. Regular classes will resume the following day.",
      image: "https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=600",
      date: "2025-09-13",
      priority: "medium"
    }
  ]);

  filteredAnnouncements = computed(() => {
    return this.announcements()
      .filter(a => {
        const matchesType = this.filterType === 'All' || a.type === this.filterType;
        const matchesSubject = this.filterSubject === 'All' || a.subject === this.filterSubject;
        const matchesSearch = a.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             a.content.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesType && matchesSubject && matchesSearch;
      })
      .sort((a, b) => {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      });
  });

  ngOnInit(): void {}

  getTypeClass(type: string) {
    const base = "bg-white/90 text-";
    switch(type) {
      case 'General': return 'bg-blue-500/20 text-blue-600 border border-blue-200 text-blue-700';
      case 'Subject': return 'bg-purple-500/20 text-purple-600 border border-purple-200 text-purple-700';
      case 'Event': return 'bg-orange-500/20 text-orange-600 border border-orange-200 text-orange-700';
      case 'Holiday': return 'bg-red-500/20 text-red-600 border border-red-200 text-red-700';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}