import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AvatarModule, ButtonModule, BadgeModule, TooltipModule, RouterModule],
  template: `
    <header class="w-full z-40 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div class="px-6 py-3 flex items-center justify-between">
        
        <div class="flex items-center gap-4 min-w-max">
          <div class="hidden sm:block">
            <h2 class="text-sm font-black text-slate-800 dark:text-gray-100 leading-tight uppercase tracking-tight">
              {{ greeting }}, {{ lastName }}
            </h2>
            <p class="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em]">
              {{ currentDate | date:'EEEE, MMM d' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          
          <button pButton 
                  [icon]="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" 
                  class="p-button-rounded p-button-text p-button-secondary dark:text-gray-300 transition-transform active:scale-90"
                  pTooltip="Toggle Mode"
                  (click)="toggleTheme()">
          </button>

          <div class="relative mr-2">
            <button pButton 
                    icon="pi pi-bell" 
                    routerLink="/notifications"
                    class="p-button-rounded p-button-text p-button-secondary dark:text-gray-300">
            </button>
            <span class="absolute top-2 right-2 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>

          <div class="pl-4 border-l border-gray-200 dark:border-slate-700 flex items-center gap-4 ml-2">
            <div class="text-right hidden sm:block">
              <p class="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-none">P. Santos</p>
              <p class="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">Active</p>
            </div>
            
            <a routerLink="/profile" class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 blur-[1px]"></div>
              <p-avatar 
                image="https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick" 
                size="large" 
                shape="circle"
                styleClass="relative border-2 border-white dark:border-slate-900 shadow-sm cursor-pointer scale-90 transition-transform group-active:scale-75">
              </p-avatar>
            </a>
          </div>

        </div>
      </div>
    </header>
  `,
  styles: [`
    :host ::ng-deep .p-avatar.p-avatar-lg {
      width: 2.5rem;
      height: 2.5rem;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  lastName = 'Prof. Santos';
  currentDate = new Date();
  greeting = '';

  ngOnInit() {
    this.setGreeting();
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.applyTheme(true);
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  toggleTheme() {
    this.applyTheme(!this.isDarkMode);
  }

  private applyTheme(dark: boolean) {
    this.isDarkMode = dark;
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}