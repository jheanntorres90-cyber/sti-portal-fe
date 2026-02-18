import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-parent-feedback',
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
 templateUrl: './feedback.component.html',
  
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