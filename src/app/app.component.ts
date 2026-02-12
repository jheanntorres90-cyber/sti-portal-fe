import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden transition-colors duration-300">
      
      <app-sidebar></app-sidebar>
      
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        
        <app-header></app-header>
        
        <main class="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 scroll-smooth custom-scrollbar">
          <div class="max-w-[1400px] mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
        
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
      width: 100%;
    }

    /* Modern Minimalist Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      @apply bg-slate-200 dark:bg-slate-800 rounded-full;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      @apply bg-slate-300 dark:bg-slate-700;
    }

    /* Ensure smooth transitions for dark mode toggle */
    * {
      @apply transition-colors duration-200;
    }
  `]
})
export class AppComponent {
  title = 'student-portal';
}