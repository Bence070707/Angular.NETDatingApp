import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private accountService = inject(AccountService);

  InitService(): Observable<any> {
    const user = localStorage.getItem('user');
    if(user){
      this.accountService.setCurrentUser(JSON.parse(user));
    }
    return of(null);
  }
}
