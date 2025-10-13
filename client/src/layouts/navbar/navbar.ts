import { Component, inject, OnInit, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { LoginCreds } from '../../types/user';
import { Router, RouterLink } from "@angular/router";
import { RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  protected creds : LoginCreds = { email: '', password: '' };
  protected accountService: AccountService = inject(AccountService);
  private router = inject(Router);
  private toasts = inject(ToastService);
  protected selectedTheme = signal<string>(localStorage.getItem("theme") ?? "light");
  protected themes = themes;
  
  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }
  changeTheme(theme: string){
    this.selectedTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
    const elem = document.activeElement as HTMLDivElement;{
      if(elem) elem.blur();
    }
  }
  
  login(){
    this.accountService.login(this.creds).subscribe({
      next: response => {
        this.creds = { email: '', password: '' };
        this.router.navigateByUrl('/members');
        this.toasts.showSuccess('Login successful');
      },
      error: err => {
        console.error(err);
        this.toasts.showError(err.error);
      }
      
    })
  }
  
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toasts.showInfo('Logged out');
  }
}
