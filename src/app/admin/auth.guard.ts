import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // debugger; // The browser will stop here if you have F12 open
  
  if (token && token !== 'undefined' && token !== 'null') {
    return true; 
  } else {
    localStorage.removeItem('token');
    router.navigate(['/admin/login']); 
    return false;
  }
};