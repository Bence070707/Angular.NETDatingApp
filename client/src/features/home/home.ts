import { Component, signal } from '@angular/core';
import { Register } from "../register/register";

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected registerMode = signal(false);

  protected toggleRegisterMode(): void {
    this.registerMode.set(!this.registerMode());
  }

}
