import { Component, inject, output, OutputOptions, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected creds : RegisterCreds = {displayName: '', email: '', password: ''};
  protected accountService : AccountService = inject(AccountService);
  protected toggleRegisterMode = output();

  register() {
    this.accountService.register(this.creds).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.toggleRegisterMode.emit();
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }

  cancel() {
    this.creds = {displayName: '', email: '', password: ''};
    this.toggleRegisterMode.emit();
  }
}
