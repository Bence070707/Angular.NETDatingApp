import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http: HttpClient = inject(HttpClient);
  private likesService = inject(LikesService);
  private baseUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);

  login(creds: LoginCreds) {
    return this.http.post(this.baseUrl + 'account/login', creds, {withCredentials: true}).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user as User);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  register(creds: RegisterCreds) {
    return this.http.post(this.baseUrl + 'account/register', creds, {withCredentials: true}).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user as User);
          this.startTokenRefreshInterval();
        }
      })
    );
  }

  refreshToken(){
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true});
  }

  startTokenRefreshInterval(){
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true}).subscribe({
        next: user => {
          this.setCurrentUser(user);
        },
        error: () => {
          this.logout();
        }
      })
    }, 5 * 60 * 1000);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  getCurrentUser() {
    return this.currentUser();
  }

  private getRolesFromToken(user: User) : string[]{
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
