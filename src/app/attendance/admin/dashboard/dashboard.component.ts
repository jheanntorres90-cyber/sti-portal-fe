import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface StatCard {
  value: string;
  label: string;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
}

interface QuickAction {
  label: string;
  icon: string;
  action: string;
}

interface Activity {
  time: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, CardModule, ButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
stats: StatCard[] = [
  { value: '3,240', label: 'Total Students', icon: 'fas fa-users', color: 'blue' },
  { value: '142', label: 'Total Faculty', icon: 'fas fa-chalkboard-teacher', color: 'yellow' },
  { value: '92%', label: 'Attendance Today', icon: 'fas fa-calendar-check', color: 'green' },
  { value: '18', label: 'Active Announcements', icon: 'fas fa-bullhorn', color: 'purple' }
];
  
quickActions: QuickAction[] = [
  { label: 'Attendance', icon: 'fas fa-calendar-check', action: 'attendance' },
  { label: 'Students', icon: 'fas fa-user-graduate', action: 'students' },
  { label: 'Schedule', icon: 'fas fa-clock', action: 'schedule' },
  { label: 'Announcements', icon: 'fas fa-bullhorn', action: 'announcements' }
];
  
activities: Activity[] = [
  {time: '08:00 AM', text: 'Gate Attendance recorded for John Doe (RFID)',icon: 'fas fa-id-card'},
  { time: '08:15 AM', text: 'Gate Attendance recorded for Jane Smith (Face Recognition)', icon: 'fas fa-camera' },
  { time: '09:00 AM', text: 'Math class attendance submitted by Dr. Rodriguez', icon: 'fas fa-chalkboard'},
  { time: '10:30 AM', text: 'New student enrollment completed', icon: 'fas fa-user-plus' },
  { time: '11:00 AM', text: 'Announcement posted: "Library hours extended"', icon: 'fas fa-bullhorn' },
];


  notificationsCount: number = 3;

  ngOnInit(): void {
    this.showWelcomeAlert();
    this.simulateSystemAlerts();
  }

  private showWelcomeAlert(): void {
    this.showAlert('Welcome to Admin Dashboard! System is running smoothly.', 'info');
  }

  private simulateSystemAlerts(): void {
    setTimeout(() => {
      this.showAlert('System maintenance scheduled for tonight at 11 PM', 'warning');
    }, 5000);
    
    setTimeout(() => {
      this.showAlert('Daily backup completed successfully', 'success');
    }, 10000);
  }

  handleQuickAction(action: string): void {
    const actionMessages: { [key: string]: string } = {
      attendance: 'Opening Attendance Management...',
      students: 'Opening Student Management...',
      schedule: 'Schedule module is under maintenance',
      announcements: 'Opening Announcements Management...'
    };
    
    const message = actionMessages[action] || 'Action not available';
    const type = action === 'schedule' ? 'warning' : 'info';
    
    this.showAlert(message, type);
  }

  handleStatClick(stat: StatCard): void {
    this.showAlert(`Viewing details for: ${stat.label} (${stat.value})`, 'info');
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 5000): void {
    const alertElement = document.createElement('div');
    alertElement.textContent = message;
    alertElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    `;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
      alertElement.remove();
    }, duration);
  }
}