import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 lg:p-10 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div class="mb-10">
        <h1 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Account Settings</h1>
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Configure your portal and security preferences</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 divide-y dark:divide-slate-800 overflow-hidden shadow-sm">
        
        <div class="p-8">
          <h2 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Security & Authentication</h2>
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="text-sm font-bold dark:text-white">Change Password</p>
              <p class="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Last changed 3 months ago</p>
            </div>
            <button class="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Update</button>
          </div>
        </div>

        <div class="p-8">
          <h2 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">App Preferences</h2>
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="text-sm font-bold dark:text-white">Email Notifications</p>
              <p class="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Receive daily attendance summaries</p>
            </div>
            <div class="w-12 h-6 bg-blue-600 rounded-full relative"><div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
          </div>
        </div>

        <div class="p-8 bg-rose-50/30 dark:bg-rose-900/5">
          <h2 class="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-4">Danger Zone</h2>
          <p class="text-xs text-slate-500 mb-6 font-medium">Resetting your portal data will clear all local filters and cache. This cannot be undone.</p>
          <button class="px-6 py-3 border-2 border-rose-200 dark:border-rose-900/30 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Reset Portal Session</button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {}