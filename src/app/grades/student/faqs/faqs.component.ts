import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 sm:p-8 transition-colors duration-300">
      <p-toast></p-toast>
      
      <div class="max-w-4xl mx-auto space-y-8">
        
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium">Find answers to common portal concerns</p>
        </div>

        <div class="relative max-w-2xl mx-auto group">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"></i>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search questions..." 
            class="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 
                   bg-white dark:bg-[#0f172a] 
                   text-slate-900 dark:text-slate-100 
                   outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>

        <div class="faq-wrapper rounded-3xl overflow-hidden shadow-sm">
          <p-accordion [multiple]="false">
            <p-accordionTab *ngFor="let f of filteredFAQs()">
              <ng-template pTemplate="header">
                <span class="font-bold text-slate-800 dark:text-slate-100">{{ f.question }}</span>
              </ng-template>
              
              <div class="space-y-4">
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {{ f.answer }}
                </p>
              </div>
            </p-accordionTab>
          </p-accordion>
          
          <div *ngIf="filteredFAQs().length === 0" class="p-20 text-center bg-white dark:bg-[#0f172a]">
            <p class="text-slate-500 dark:text-slate-400 font-bold">No results found for "{{searchQuery}}"</p>
          </div>
        </div>

        <div class="text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
          <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">Still need help? Email us at 
            <a href="mailto:oneapp@sti.edu" class="font-black underline">oneapp&#64;sti.edu</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Force PrimeNG to adapt to Dark Mode */
    :host ::ng-deep .dark .p-accordion .p-accordion-header .p-accordion-header-link {
      background: #1e293b !important; /* Dark Slate background */
      color: #f8fafc !important;      /* White text */
      border: 1px solid #334155 !important;
      border-bottom: none;
    }

    :host ::ng-deep .dark .p-accordion .p-accordion-content {
      background: #0f172a !important; /* Even darker background for the answer */
      color: #cbd5e1 !important;      /* Light gray text */
      border: 1px solid #334155 !important;
    }

    /* Keep the light mode looking clean */
    :host ::ng-deep .p-accordion .p-accordion-header:first-child .p-accordion-header-link {
      border-top-left-radius: 1.5rem;
      border-top-right-radius: 1.5rem;
    }
    :host ::ng-deep .p-accordion .p-accordion-tab:last-child .p-accordion-header-link {
      border-bottom-left-radius: 1.5rem;
      border-bottom-right-radius: 1.5rem;
    }
  `]
})
export class FaqsComponent implements OnInit {
  searchQuery = '';
  
  faqs = signal([
    { question: "How to log-in", answer: "Sign-in using your STI Microsoft Office 365 account. Check your Registration Form for details." },
    { question: "My email account is not working", answer: "Ensure you use the new format (@sti.edu.ph). Contact the Registrar if your record needs linking." },
    { question: "Grades Visibility", answer: "Grades are encoded by instructors. If missing, please contact your subject teacher." },
    { question: "Class Schedule", answer: "Confirm schedules through the Registrar's Office for room or time discrepancies." },
    { question: "Portal not loading", answer: "Try clearing browser cache or using a different browser (Chrome/Edge recommended)." }
  ]);

  filteredFAQs = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    return this.faqs().filter(f => 
      f.question.toLowerCase().includes(query) || 
      f.answer.toLowerCase().includes(query)
    );
  });

  constructor(private messageService: MessageService) {}
  ngOnInit() {}
}