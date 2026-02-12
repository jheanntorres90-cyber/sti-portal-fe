import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for two-way binding

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        <div class="h-32 bg-blue-700 w-full relative">
           <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.2),transparent)]"></div>
        </div>

        <div class="px-8 pb-8">
          <div class="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
            <div class="w-32 h-32 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-xl">
              <div class="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl font-black text-blue-600">
                {{ user.initials }}
              </div>
            </div>
            
            <div class="text-center md:text-left flex-1">
              <div *ngIf="!isEditing; else editTitle">
                <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ user.name }}</h1>
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{{ user.department }}</p>
              </div>
              <ng-template #editTitle>
                <input [(ngModel)]="user.name" class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight p-2 w-full focus:ring-2 focus:ring-blue-500 mb-1">
                <input [(ngModel)]="user.department" class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[11px] font-bold text-slate-500 uppercase tracking-widest p-2 w-full focus:ring-2 focus:ring-blue-500">
              </ng-template>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t dark:border-slate-800">
            
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</label>
                <p *ngIf="!isEditing" class="font-bold dark:text-white mt-1 uppercase">{{ user.id }}</p>
                <input *ngIf="isEditing" [(ngModel)]="user.id" class="edit-input">
              </div>
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <p *ngIf="!isEditing" class="font-bold dark:text-white mt-1 lowercase">{{ user.email }}</p>
                <input *ngIf="isEditing" [(ngModel)]="user.email" type="email" class="edit-input">
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Load</label>
                <p *ngIf="!isEditing" class="font-bold dark:text-white mt-1 uppercase">{{ user.load }}</p>
                <input *ngIf="isEditing" [(ngModel)]="user.load" class="edit-input">
              </div>

              <div class="pt-2">
                <button *ngIf="!isEditing" 
                        (click)="toggleEdit()"
                        class="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  Edit Professional Profile
                </button>

                <div *ngIf="isEditing" class="flex gap-2">
                  <button (click)="saveChanges()"
                          class="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Save Changes
                  </button>
                  <button (click)="toggleEdit()"
                          class="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .edit-input {
      @apply w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg font-bold dark:text-white mt-1 p-2 focus:ring-2 focus:ring-blue-500 transition-all;
    }
  `]
})
export class ProfileComponent {
  // Initial user data
  user = {
    name: 'Prof. Patrick Santos',
    initials: 'PS',
    department: 'Full-Time Faculty • IT Department',
    id: 'STI-BAC-2024-001',
    email: 'p.santos@sti.edu.ph',
    load: '21 Units • 6 Sections'
  };

  isEditing = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    // Here you would normally call an API to save the data
    console.log('Saved changes:', this.user);
    this.isEditing = false;
    
    // Update initials in case name changed
    const names = this.user.name.split(' ');
    if (names.length >= 2) {
      this.user.initials = (names[0][0] + names[names.length-1][0]).toUpperCase();
    }
  }
}