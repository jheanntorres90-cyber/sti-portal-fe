import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-parent-mvsh',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TooltipModule, ToastModule],
  providers: [MessageService],
  templateUrl: './mvsh.component.html',

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