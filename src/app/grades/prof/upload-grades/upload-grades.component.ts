import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  grades: {
    prelim: number;
    midterm: number;
    prefinal: number;
    final: number;
  };
  remarks?: string;
}

@Component({
  selector: 'app-upload-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 animate-in fade-in duration-500">
      
      <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div class="flex items-center gap-5">
          <button *ngIf="currentStep > 1" (click)="handleBack()" 
            class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-all flex items-center justify-center shadow-sm group">
            <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          </button>

          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ currentStep === 1 ? 'Grade Management' : (currentStep === 2 ? 'Grade Entry' : 'Final Submission') }}
            </h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Academic Year 2025-2026 • Second Semester</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div [class]="currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'" class="w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all">1</div>
          <div class="w-4 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div [class]="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'" class="w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all">2</div>
          <div class="w-4 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div [class]="currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'" class="w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all">3</div>
        </div>
      </div>

      <div *ngIf="currentStep === 1" class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div (click)="selectMethod('manual')" class="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer">
          <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            <i class="fas fa-keyboard"></i>
          </div>
          <h2 class="text-2xl font-bold dark:text-white">Manual Entry</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Input grades per period directly into the secure smart-table.</p>
        </div>
        <div (click)="selectMethod('import')" class="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-green-500 transition-all cursor-pointer">
            <div class="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6"><i class="fas fa-file-excel"></i></div>
            <h2 class="text-2xl font-bold dark:text-white">Excel Import</h2>
            <p class="text-slate-500 dark:text-slate-400 mt-2 italic text-sm">Automated template validation.</p>
        </div>
        <div (click)="selectMethod('advanced')" class="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer">
            <div class="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6"><i class="fas fa-layer-group"></i></div>
            <h2 class="text-2xl font-bold dark:text-white">Bulk Sections</h2>
            <p class="text-slate-500 dark:text-slate-400 mt-2 italic text-sm">Batch filtering system.</p>
        </div>
      </div>

      <div *ngIf="currentStep === 2" class="space-y-6 animate-in fade-in duration-500">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Course Handle</label>
            <select class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500">
              <option *ngFor="let c of profCourses">{{ c }}</option>
            </select>
          </div>
          <div class="md:col-span-3 space-y-1">
            <label class="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Active Grading Period</label>
            <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button *ngFor="let p of periods" (click)="activePeriod = p.id"
                [class]="activePeriod === p.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'"
                class="flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all">
                {{ p.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-400 font-black border-b dark:border-slate-800">
              <tr>
                <th class="px-8 py-5">Student</th>
                <th class="px-4 py-5 text-center" *ngFor="let p of periods">{{ p.label }}</th>
                <th class="px-8 py-5 text-right">Average</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800">
              <tr *ngFor="let s of students">
                <td class="px-8 py-5">
                  <p class="font-bold dark:text-white">{{ s.name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ s.id }}</p>
                </td>
                <td class="px-4 py-5 text-center" *ngFor="let p of periods">
                  <input type="number" [(ngModel)]="s.grades[p.id]" (ngModelChange)="markAsDirty()"
                    [disabled]="activePeriod !== p.id"
                    [class]="activePeriod === p.id ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-sm' : 'bg-transparent border-transparent text-slate-400'"
                    class="w-16 text-center border-2 rounded-xl p-2 font-bold outline-none transition-all">
                </td>
                <td class="px-8 py-5 text-right">
                  <span class="font-black text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                    {{ calculateAverage(s.grades) | number:'1.0-0' }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="p-8 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-between items-center">
            <button (click)="handleBack()" class="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
              <i class="fas fa-times"></i> Cancel Entry
            </button>
            <div class="flex gap-4">
              <button (click)="saveDraft()" [disabled]="isSaving"
                class="px-8 py-3 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
                <i *ngIf="isSaving" class="fas fa-spinner fa-spin"></i>
                {{ isSaving ? 'Saving...' : 'Save Draft' }}
              </button>
              <button (click)="currentStep = 3" class="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition">
                Review & Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="currentStep === 3" class="max-w-3xl mx-auto text-center py-20 animate-in zoom-in-95">
          <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner"><i class="fas fa-check-double"></i></div>
          <h2 class="text-4xl font-black dark:text-white">Ready to Finalize?</h2>
          <p class="text-slate-500 mt-2">Please double-check all grades before final submission.</p>
          <div class="mt-12 flex gap-4 justify-center">
            <button (click)="currentStep = 2" class="px-12 py-4 rounded-2xl font-bold border-2 dark:border-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">Go Back</button>
            <button (click)="confirmUpload()" class="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition">Confirm Submission</button>
          </div>
      </div>

      <div *ngIf="showBackConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 border dark:border-slate-800">
          <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"><i class="fas fa-exclamation-triangle"></i></div>
          <h2 class="text-2xl font-black text-center dark:text-white mb-2">Discard changes?</h2>
          <p class="text-center text-slate-500 mb-8 leading-relaxed">You have unsaved grades. If you leave now, your progress in this session will be lost.</p>
          <div class="flex flex-col gap-3">
            <button (click)="showBackConfirm = false" class="py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30">Keep Editing</button>
            <button (click)="confirmBack()" class="py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">Yes, Discard Work</button>
          </div>
        </div>
      </div>

      <div *ngIf="showSaveToast" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10">
        <i class="fas fa-check-circle text-green-400"></i>
        <span class="font-bold">Draft saved successfully!</span>
      </div>

    </div>
  `,
  styles: [`
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  `]
})
export class UploadGradesComponent {
  currentStep = 1;
  activePeriod: 'prelim' | 'midterm' | 'prefinal' | 'final' = 'prelim';
  
  isDirty = false;
  isSaving = false;
  showBackConfirm = false;
  showSaveToast = false;

  periods: {id: 'prelim'|'midterm'|'prefinal'|'final', label: string}[] = [
    { id: 'prelim', label: 'Prelims' },
    { id: 'midterm', label: 'Midterms' },
    { id: 'prefinal', label: 'Pre-Finals' },
    { id: 'final', label: 'Finals' }
  ];

  profCourses = ['CS201 - Data Structures', 'IPT101 - Integrative Programming'];
  students: Student[] = [
    { id: '2024-0001', name: 'Maria Santos', grades: { prelim: 85, midterm: 88, prefinal: 0, final: 0 } },
    { id: '2024-0002', name: 'Juan Dela Cruz', grades: { prelim: 75, midterm: 70, prefinal: 0, final: 0 } }
  ];

  markAsDirty() {
    this.isDirty = true;
  }

  handleBack() {
    // If we are in the review step, just go back to entry
    if (this.currentStep === 3) {
        this.currentStep = 2;
        return;
    }

    // If we are in the entry step, check if data is unsaved
    if (this.isDirty) {
      this.showBackConfirm = true;
    } else {
      this.currentStep = 1;
    }
  }

  confirmBack() {
    this.isDirty = false;
    this.showBackConfirm = false;
    this.currentStep = 1;
  }

  saveDraft() {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.isDirty = false;
      this.showSaveToast = true;
      setTimeout(() => this.showSaveToast = false, 3000);
    }, 1200);
  }

  selectMethod(method: string) {
    this.currentStep = 2;
  }

  calculateAverage(grades: any): number {
    const values = Object.values(grades).filter((v: any) => v > 0) as number[];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b) / values.length;
  }

  confirmUpload() {
    alert(`Successfully submitted ${this.activePeriod} grades!`);
    this.isDirty = false;
    this.currentStep = 1;
  }
}