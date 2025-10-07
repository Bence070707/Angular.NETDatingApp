import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);
  
  if(!accountService.getCurrentUser()) {
    toastService.showError('You must be logged in to access this page');
    return false;
  }
  return true;
};
