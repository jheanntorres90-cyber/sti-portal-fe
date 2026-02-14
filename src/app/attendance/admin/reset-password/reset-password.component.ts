  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule } from '@angular/forms';

  interface Alert {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    typeClass: string;
    icon: string;
    title: string;
    message: string;
    show: boolean;
  }

  @Component({
    selector: 'app-admin-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',

  })
  export class AdminResetPasswordComponent implements OnInit, OnDestroy {
    // Date
    currentDate: string = '';
    
    // Forms
    searchForm: FormGroup;
    resetForm: FormGroup;
    
    // UI States
    isSearching: boolean = false;
    isResetting: boolean = false;
    showResetSection: boolean = false;
    adminName: string = '';
    
    // Password strength
    passwordStrength: number = 0;
    passwordStrengthClass: string = '';
    
    // Alerts
    alerts: Alert[] = [];
    private alertTimeouts: Map<string, any> = new Map();
    
    // Theme
    isDarkTheme: boolean = false;

    constructor(private fb: FormBuilder) {
      // Initialize search form
      this.searchForm = this.fb.group({
        searchQuery: ['', [Validators.required, Validators.minLength(3)]]
      });

      // Initialize reset form
      this.resetForm = this.fb.group({
        newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
      this.setCurrentDate();
      this.loadThemePreference();
    }

    ngOnDestroy(): void {
      // Clear all alert timeouts
      this.alertTimeouts.forEach(timeout => clearTimeout(timeout));
      this.alertTimeouts.clear();
    }

    // Custom validator for password match
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      
      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    }

    // Set current date
    setCurrentDate(): void {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      this.currentDate = now.toLocaleDateString('en-US', options);
    }

    // Theme handling
    loadThemePreference(): void {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkTheme = savedTheme === 'dark';
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    }

    toggleTheme(): void {
      this.isDarkTheme = !this.isDarkTheme;
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }

    // Search admin
    searchAdmin(): void {
      if (this.searchForm.invalid) {
        this.showAlert('Please enter a username or email address to search.', 'warning');
        return;
      }

      const query = this.searchForm.get('searchQuery')?.value;
      this.isSearching = true;
      
      this.showAlert(`Searching for admin: ${query}`, 'info');
      
      // Simulate API call
      setTimeout(() => {
        this.isSearching = false;
        this.showResetSection = true;
        this.adminName = query;
        
        // Scroll to reset section
        setTimeout(() => {
          const element = document.getElementById('resetSection');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        
        this.showAlert(`Admin account found: ${query}`, 'success');
      }, 1500);
    }

    // Reset password
    resetPassword(): void {
      if (this.resetForm.invalid) {
        if (this.resetForm.get('newPassword')?.errors?.['required']) {
          this.showAlert('Password is required!', 'error');
        } else if (this.resetForm.get('newPassword')?.errors?.['minlength']) {
          this.showAlert('Password must be at least 8 characters long!', 'error');
        } else if (this.resetForm.get('newPassword')?.errors?.['pattern']) {
          this.showAlert('Password must contain uppercase, lowercase, number and special character!', 'error');
        } else if (this.resetForm.errors?.['passwordMismatch']) {
          this.showAlert('New passwords do not match!', 'error');
        }
        return;
      }

      this.isResetting = true;
      this.showAlert(`Resetting password for ${this.adminName}...`, 'info');
      
      // Simulate API call
      setTimeout(() => {
        this.isResetting = false;
        this.showAlert(`Password successfully reset for ${this.adminName}`, 'success');
        
        // Reset form
        this.resetForm.reset();
        this.passwordStrength = 0;
        this.passwordStrengthClass = '';
        
        // Hide reset section
        setTimeout(() => {
          this.showResetSection = false;
          this.adminName = '';
          this.searchForm.reset();
        }, 2000);
      }, 2000);
    }

    // Check password strength
    checkPasswordStrength(): void {
      const password = this.resetForm.get('newPassword')?.value || '';
      let strength = 0;
      
      const requirements = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
      };

      // Calculate strength
      if (requirements.length) strength += 20;
      if (requirements.lowercase) strength += 20;
      if (requirements.uppercase) strength += 20;
      if (requirements.numbers) strength += 20;
      if (requirements.special) strength += 20;

      this.passwordStrength = strength;
      
      // Set strength class
      if (strength <= 40) {
        this.passwordStrengthClass = 'weak';
      } else if (strength <= 80) {
        this.passwordStrengthClass = 'medium';
      } else {
        this.passwordStrengthClass = 'strong';
      }
    }

    // Show notifications
    showNotifications(): void {
      this.showAlert('You have 3 new notifications', 'info');
    }

    // Modern Alert System
    showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', duration: number = 5000): void {
      const alertId = 'alert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      const alertConfig = {
        success: {
          icon: 'fas fa-check-circle',
          title: 'Success',
          class: 'alert-success'
        },
        info: {
          icon: 'fas fa-info-circle',
          title: 'Information',
          class: 'alert-info'
        },
        warning: {
          icon: 'fas fa-exclamation-triangle',
          title: 'Warning',
          class: 'alert-warning'
        },
        error: {
          icon: 'fas fa-times-circle',
          title: 'Error',
          class: 'alert-error'
        }
      };
      
      const config = alertConfig[type];
      
      const alert: Alert = {
        id: alertId,
        type: type,
        typeClass: config.class,
        icon: config.icon,
        title: config.title,
        message: message,
        show: false
      };
      
      this.alerts.push(alert);
      
      // Animate in
      setTimeout(() => {
        const index = this.alerts.findIndex(a => a.id === alertId);
        if (index !== -1) {
          this.alerts[index].show = true;
        }
      }, 10);
      
      // Auto remove after duration
      if (duration > 0) {
        const timeout = setTimeout(() => {
          this.removeAlert(alertId);
        }, duration);
        
        this.alertTimeouts.set(alertId, timeout);
      }
    }
    
    removeAlert(alertId: string): void {
      const index = this.alerts.findIndex(a => a.id === alertId);
      if (index !== -1) {
        // Clear timeout
        if (this.alertTimeouts.has(alertId)) {
          clearTimeout(this.alertTimeouts.get(alertId));
          this.alertTimeouts.delete(alertId);
        }
        
        // Hide alert
        this.alerts[index].show = false;
        
        // Remove after animation
        setTimeout(() => {
          this.alerts = this.alerts.filter(a => a.id !== alertId);
        }, 400);
      }
    }
  }