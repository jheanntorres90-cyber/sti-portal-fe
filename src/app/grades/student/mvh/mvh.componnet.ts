import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-mvsh',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TooltipModule, ToastModule],
  providers: [MessageService],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <p-toast></p-toast>
      
      <main class="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
        
        <div class="space-y-2">
          <h2 class="text-3xl font-black tracking-tight">Our Core Values</h2>
          <p class="text-slate-500 font-medium italic">Discover the foundation that guides STI's commitment to education</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i class="pi pi-target"></i>
            </div>
            <h3 class="text-2xl font-black mb-4 uppercase tracking-tighter">Mission</h3>
            <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>We are an institution committed to provide knowledge through the development and delivery of superior learning systems.</p>
              <p>We strive to provide optimum value to all our stakeholders—our students, our faculty members, our employees, our partners, our shareholders, and our community.</p>
              <p>We will pursue this mission with utmost integrity, dedication, transparency, and creativity.</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div class="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              <i class="pi pi-eye"></i>
            </div>
            <h3 class="text-2xl font-black mb-4 uppercase tracking-tighter">Vision</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              To be the leader in innovative and relevant education that nurtures individuals to become competent and responsible members of society.
            </p>
          </div>
        </div>

        <div class="bg-slate-900 dark:bg-blue-950 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div class="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <i class="pi pi-music text-[150px] text-white"></i>
          </div>

          <div class="p-8 md:p-12">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              <div class="text-center md:text-left">
                <h3 class="text-3xl font-black text-white mb-2 uppercase tracking-widest">STI Hymn</h3>
                <p class="text-blue-300 font-bold uppercase text-xs tracking-widest">The official school anthem</p>
              </div>

              <div class="flex flex-wrap justify-center gap-3">
                <button (click)="toggleHymn()" 
                        [class]="isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'"
                        class="px-6 py-3 rounded-2xl text-white font-black text-xs uppercase flex items-center gap-2 transition-all shadow-lg">
                  <i [class]="isPlaying ? 'pi pi-pause' : 'pi pi-play'"></i>
                  {{ isPlaying ? 'Pause' : 'Play' }} Hymn
                </button>
                <button (click)="printHymn()" class="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all">
                  <i class="pi pi-print"></i>
                </button>
                <button (click)="shareHymn()" class="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all">
                  <i class="pi pi-share-alt"></i>
                </button>
              </div>
            </div>

            <div class="hymn-lyrics-container max-w-2xl mx-auto text-center">
              <div class="space-y-6 text-blue-50/90 font-bold text-lg md:text-xl leading-relaxed italic">
                <p class="animate-pulse-slow">Aim high with STI<br>The future is here today<br>Fly high with STI<br>Be the best that you can be</p>
                <p>Onward to tomorrow<br>With dignity and pride<br>A vision of excellence<br>Our resounding battle cry</p>
                <p>Aim high with STI<br>The future is here today<br>Fly high with STI<br>Be the best that you can be</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    @media print {
      .bg-slate-50 { background: white !important; }
      .bg-slate-900 { background: white !important; color: black !important; border: 1px solid #eee; }
      .text-white, .text-blue-50, .text-blue-300 { color: black !important; }
      button, p-toast { display: none !important; }
    }
    .animate-pulse-slow {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
  `]
})
export class MvshComponent implements OnInit {
  isDarkMode = signal(false);
  isPlaying = false;

  constructor(private messageService: MessageService) {
    effect(() => {
      this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }

  toggleHymn() {
    this.isPlaying = !this.isPlaying;
    const summary = this.isPlaying ? 'Audio Started' : 'Audio Paused';
    const detail = this.isPlaying ? 'STI Hymn is now playing...' : 'STI Hymn playback stopped.';
    
    this.messageService.add({ 
      severity: this.isPlaying ? 'info' : 'warn', 
      summary: summary, 
      detail: detail 
    });
  }

  printHymn() {
    window.print();
  }

  async shareHymn() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'STI Mission, Vision & Hymn',
          text: 'Check out the core values of STI Bacoor!',
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Share', 
        detail: 'Link copied to clipboard (Simulated)' 
      });
    }
  }
}