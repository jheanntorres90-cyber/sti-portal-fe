import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { LandingComponent } from './landing-component/landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: [
    `
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
    `,
  ],
})
export class AppComponent {
  title = 'student-portal';
}
