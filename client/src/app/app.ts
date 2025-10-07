import { Component, inject } from '@angular/core';
import { Navbar } from "../layouts/navbar/navbar";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [Navbar, RouterOutlet],
})
export class App{
  protected router = inject(Router);
}
