import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Attendance Settings</h1>
      <p class="text-gray-600">Configure attendance system settings.</p>
    </div>
  `,
  styles: []
})
export class AttendanceSettingsComponent {}