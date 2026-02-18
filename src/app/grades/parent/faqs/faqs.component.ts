import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-parent-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionModule, ToastModule],
  providers: [MessageService],
  templateUrl: './faqs.component.html',

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