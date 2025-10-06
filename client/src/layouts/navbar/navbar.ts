import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { LoginCreds } from '../../types/user';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  protected creds : LoginCreds = { email: '', password: '' };
  protected accountService: AccountService = inject(AccountService);

  login(){
    this.accountService.login(this.creds).subscribe({
      next: response => {
        this.accountService.login(this.creds);
        this.creds = { email: '', password: '' };
      },
      error: err => {
        console.error(err);
      }
      
    })
  }
  
  logout(){
    this.accountService.logout();
  }
}
