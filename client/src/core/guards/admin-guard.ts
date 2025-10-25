import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);

  if(accountService.getCurrentUser()?.roles.includes('Admin') || accountService.getCurrentUser()?.roles.includes('Moderator')){
    return true;
  } else {
    toast.showError('You do not have permission to access this area');
    return false;
  }
};
