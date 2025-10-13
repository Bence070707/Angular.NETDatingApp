import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);

  login(creds: LoginCreds) {
    return this.http.post(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user as User);
        }
      })
    );
  }

  register(creds: RegisterCreds) {
    return this.http.post(this.baseUrl + 'account/register', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user as User);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser() {
    return this.currentUser();
  }
}
