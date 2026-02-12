import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  // For demo: always authenticated
  // In real app: check localStorage or token
  const isAuthenticated = true;
  
  if (isAuthenticated) {
    return true;
  }
  
  return router.parseUrl('/auth/login');
};