import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../layouts/navbar/navbar";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [Navbar, Home],
})
export class App implements OnInit {
  private accountService = inject(AccountService);

  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if(user){
      this.accountService.setCurrentUser(JSON.parse(user));
    }
  }
}
