import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-parent-about',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    ToastModule, 
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './about.component.html'
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