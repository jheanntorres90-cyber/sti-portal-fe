import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, PasswordModule, CheckboxModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sti-blue to-sti-dark-blue"></div>
      
      <div class="w-full max-w-lg animate-slideUp">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sti-blue to-sti-dark-blue rounded-2xl shadow-xl mb-4">
            <i class="pi pi-graduation-cap text-3xl text-white"></i>
          </div>
          <h1 class="text-3xl font-heading font-bold text-gray-800">STI University Portal</h1>
          <p class="text-gray-600 mt-2">Sign in to access the education management system</p>
        </div>

        <!-- Login Card -->
        <p-card class="shadow-2xl border-0">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                <i class="pi pi-user mr-2"></i>
                Username
              </label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-user"></i>
                </span>
                <input pInputText 
                       [(ngModel)]="username" 
                       name="username" 
                       placeholder="Enter your username"
                       class="w-full"
                       required>
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                <i class="pi pi-lock mr-2"></i>
                Password
              </label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-lock"></i>
                </span>
                <input pInputText 
                       [(ngModel)]="password" 
                       name="password" 
                       type="password" 
                       placeholder="Enter your password"
                       class="w-full"
                       required>
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p-checkbox [(ngModel)]="rememberMe" 
                           name="rememberMe" 
                           [binary]="true"
                           inputId="rememberMe">
                </p-checkbox>
                <label for="rememberMe" class="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <a href="#" class="text-sm text-sti-blue hover:text-sti-dark-blue font-medium">Forgot password?</a>
            </div>

            <!-- Submit Button -->
            <button pButton 
                    type="submit" 
                    label="Sign In" 
                    class="w-full"
                    [loading]="loading"
                    [disabled]="loading">
            </button>

            <!-- Demo Credentials -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-center text-gray-600">
                <i class="pi pi-info-circle mr-2"></i>
                Demo Credentials:
                <br>
                <span class="font-semibold text-sti-blue">Username: admin</span> | 
                <span class="font-semibold text-sti-blue">Password: admin123</span>
              </p>
            </div>

            <!-- Footer -->
            <div class="pt-6 border-t border-gray-100 text-center">
              <p class="text-sm text-gray-500">
                © 2024 STI University Portal. All rights reserved.
                <br>
                <span class="text-xs">v2.1.0 • Secure Login</span>
              </p>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .animate-slideUp {
      animation: slideUp 0.6s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    ::ng-deep .p-card {
      border-radius: 1rem !important;
      border: 1px solid rgba(0, 102, 179, 0.1) !important;
    }
    
    ::ng-deep .p-inputgroup-addon {
      background: #F8FAFC !important;
      border-color: #E2E8F0 !important;
    }
    
    ::ng-deep .p-inputtext {
      background: #F8FAFC !important;
      border-color: #E2E8F0 !important;
    }
    
    ::ng-deep .p-inputtext:enabled:focus {
      box-shadow: 0 0 0 3px rgba(0, 102, 179, 0.1) !important;
      border-color: #0066B3 !important;
    }
  `]
})
export class LoginComponent {
  username = 'admin';
  password = 'admin123';
  rememberMe = true;
  loading = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      if (this.username === 'admin' && this.password === 'admin123') {
        // Store auth token
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          name: 'Prof. Santos',
          role: 'Faculty',
          id: 'FAC-2024-001'
        }));
        
        // Navigate to dashboard
        this.router.navigate(['/attendance/dashboard']);
      } else {
        alert('Invalid credentials. Use admin / admin123');
      }
      this.loading = false;
    }, 1500);
  }
}