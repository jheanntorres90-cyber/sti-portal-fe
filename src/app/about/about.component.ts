import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    ToastModule, 
    TooltipModule
  ],
  providers: [MessageService],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <p-toast></p-toast>

      <main class="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
        
        <div class="space-y-2 text-center md:text-left">
          <h2 class="text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">About STI Student Portal</h2>
          <p class="text-slate-500 font-medium text-lg">Your gateway to academic information and campus resources</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let feature of features" 
               class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div [class]="feature.colorClass" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform">
              <i [class]="feature.icon"></i>
            </div>
            <h3 class="text-xl font-black mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div class="lg:col-span-2 space-y-6">
            <section class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 class="text-2xl font-black mb-6 flex items-center gap-3">
                <i class="pi pi-info-circle text-blue-500"></i>
                The Digital Campus
              </h2>
              <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                The STI Student Portal keeps your necessary student information in this free and easy-to-use platform.
              </p>
              
              <ul class="space-y-4">
                <li *ngFor="let point of portalPoints" class="flex items-start gap-3 group">
                  <div class="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600">
                    <i class="pi pi-check"></i>
                  </div>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform cursor-default">
                    {{ point }}
                  </span>
                </li>
              </ul>

              <div class="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 rounded-r-2xl">
                <h4 class="text-amber-800 dark:text-amber-400 font-black uppercase text-xs tracking-widest mb-2">Disclaimer</h4>
                <p class="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed italic">
                  Information is for informational purposes only and requires further validation from the School Registrar.
                </p>
              </div>
            </section>
          </div>

          <div class="space-y-6">
            <div class="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
              <i class="pi pi-cog absolute -top-4 -right-4 text-7xl opacity-10 group-hover:rotate-90 transition-transform duration-1000"></i>
              <h4 class="text-xs font-black uppercase text-slate-500 tracking-widest mb-6">System Status</h4>
              
              <div class="space-y-4">
                <div *ngFor="let v of versionDetails" class="flex justify-between items-center border-b border-white/10 pb-3">
                  <span class="text-xs text-slate-400 font-bold uppercase">{{ v.label }}</span>
                  <span class="text-sm font-black">{{ v.value }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 class="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Support & Contact</h4>
              <div class="space-y-4">
                <div *ngFor="let contact of contacts" 
                     (click)="copyToClipboard(contact)"
                     pTooltip="Click to copy"
                     class="group cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <p class="text-[10px] font-black text-blue-500 uppercase">{{ contact.label }}</p>
                  <p class="text-sm font-bold truncate">{{ contact.value }}</p>
                </div>
              </div>
              <p class="mt-6 text-[10px] text-center text-slate-400 font-bold">Mon - Fri: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AboutComponent implements OnInit {
  isDarkMode = signal(false);

  features = [
    { title: 'Grade Tracking', icon: 'pi pi-star-fill', colorClass: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20', desc: 'Detailed grade breakdowns and progress tracking.' },
    { title: 'Class Schedule', icon: 'pi pi-calendar', colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20', desc: 'Daily room assignments and professor info.' },
    { title: 'Announcements', icon: 'pi pi-megaphone', colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20', desc: 'Campus news and important notices in real-time.' }
  ];

  portalPoints = [
    'View your grades with just a quick tap of a button',
    'Know your day-to-day class schedule with classroom details',
    'Get the latest STI news from all over the network',
    'Access important academic resources anytime'
  ];

  versionDetails = [
    { label: 'Current Version', value: '1.2.7' },
    { label: 'Last Updated', value: 'Feb 11, 2021' },
    { label: 'Developer', value: 'STI College' }
  ];

  contacts = [
    { label: 'Registrar', value: '(046) 417-8233' },
    { label: 'IT Support', value: 'itsupport@stibacoor.edu.ph' },
    { label: 'Student Affairs', value: 'studentaffairs@stibacoor.edu.ph' }
  ];

  constructor(private messageService: MessageService) {
    effect(() => {
      this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }

  /**
   * Native Clipboard implementation to avoid external library errors
   */
  copyToClipboard(contact: any) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.value).then(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Copied!', 
          detail: `${contact.label} info copied to clipboard.` 
        });
      }).catch(err => {
        console.error('Clipboard error:', err);
      });
    }
  }
}