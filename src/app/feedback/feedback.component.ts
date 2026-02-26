import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DropdownModule, 
    InputTextareaModule, 
    ButtonModule, 
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div [class.dark]="isDarkMode()" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <p-toast></p-toast>

      <main class="max-w-4xl mx-auto w-full space-y-8 animate-fadeIn">
        
        <div class="space-y-2">
          <h2 class="text-3xl font-black tracking-tight">Share Your Feedback</h2>
          <p class="text-slate-500 font-medium italic">Help us improve your experience with the STI Student Portal</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <i class="pi pi-comments absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:scale-110 transition-transform"></i>
              <h3 class="text-xl font-bold mb-4">Why give feedback?</h3>
              <p class="text-sm text-blue-100 leading-relaxed mb-4">
                Your input directly shapes the future of this portal. Whether it's a bug report or a feature idea, we listen to every student.
              </p>
              <div class="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 w-fit px-3 py-1 rounded-full">
                <i class="pi pi-bolt"></i> 24h Review
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h4 class="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Recent Activity</h4>
              <div class="space-y-4">
                <div *ngFor="let item of recentFeedback" class="flex gap-3">
                  <div class="w-1 h-8 rounded-full bg-green-500"></div>
                  <div>
                    <p class="text-[11px] font-bold leading-none">{{ item.type }}</p>
                    <p class="text-[10px] text-slate-400 mt-1 italic">{{ item.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm relative">
              
              <div *ngIf="submitted" class="absolute inset-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
                  <i class="pi pi-check-circle"></i>
                </div>
                <h3 class="text-2xl font-black mb-2">Thank You!</h3>
                <p class="text-slate-500 mb-6">Your feedback has been submitted successfully and is being reviewed by our team.</p>
                <button (click)="resetFormState()" class="text-blue-600 font-bold hover:underline">Submit another feedback</button>
              </div>

              <h2 class="text-xl font-black mb-2">We'd Love Your Input!</h2>
              <p class="text-sm text-slate-500 mb-8">Please fill out the details below.</p>

              <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-black uppercase text-slate-400 ml-1">Feedback Type</label>
                  <p-dropdown 
                    [options]="feedbackTypes" 
                    formControlName="type" 
                    placeholder="What is this regarding?"
                    styleClass="w-full rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                  </p-dropdown>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-end ml-1">
                    <label class="text-xs font-black uppercase text-slate-400">Your Message</label>
                    <span [ngClass]="{'text-red-500': charCount > 900}" class="text-[10px] font-bold text-slate-400 transition-colors">
                      {{ charCount }}/1000
                    </span>
                  </div>
                  <textarea 
                    pInputTextarea 
                    [autoResize]="true" 
                    rows="6" 
                    formControlName="message"
                    placeholder="Tell us what's on your mind..."
                    class="w-full rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  </textarea>
                </div>

                <button 
                  type="submit" 
                  [disabled]="feedbackForm.invalid || isSubmitting"
                  class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                  <i [class]="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-send'"></i>
                  {{ isSubmitting ? 'Submitting...' : 'Send Feedback' }}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  `
})
export class FeedbackComponent implements OnInit {
  isDarkMode = signal(false);
  feedbackForm: FormGroup;
  isSubmitting = false;
  submitted = false;

  feedbackTypes = [
    { label: 'Appearance & UI', value: 'look' },
    { label: 'Performance/Speed', value: 'speed' },
    { label: 'General Usability', value: 'usability' },
    { label: 'Bug/Error Report', value: 'error' },
    { label: 'Information Correctness', value: 'info' },
    { label: 'New Feature Request', value: 'features' },
    { label: 'Others', value: 'others' }
  ];

  recentFeedback = [
    { type: 'UI Improvement', time: '2 days ago' },
    { type: 'Login Performance', time: '1 week ago' },
    { type: 'New Icons Request', time: '2 weeks ago' }
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.feedbackForm = this.fb.group({
      type: [null, Validators.required],
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    effect(() => {
      this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
    });
  }

  ngOnInit() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
  }

  get charCount(): number {
    return this.feedbackForm.get('message')?.value?.length || 0;
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API latency
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitted = true;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Feedback Sent', 
          detail: 'Thank you for helping us improve!' 
        });
        console.log('Feedback Data:', this.feedbackForm.value);
      }, 1500);
    }
  }

  resetFormState() {
    this.submitted = false;
    this.feedbackForm.reset();
  }
}