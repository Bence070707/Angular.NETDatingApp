import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../types/user';
import { AccountService } from '../../core/services/account-service';
import { TextInput } from "../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected toggleRegisterMode = output();
  protected accountService: AccountService = inject(AccountService);
  private router = inject(Router);
  protected creds: RegisterCreds = {} as RegisterCreds;
  protected credsForm: FormGroup;
  protected profileForm: FormGroup;
  private formBuilder = inject(FormBuilder);
  protected currentStep = signal(1);
  protected validationsErrors = signal<string[]>([]);

  constructor() {
    this.credsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.credsForm.controls['password'].valueChanges.subscribe({
      next: () => this.credsForm.controls['confirmPassword'].updateValueAndValidity()
    });

    this.profileForm = this.formBuilder.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  nextStep() {
    if (this.credsForm.valid) {
      this.currentStep.update(value => value + 1);
    }
  }

  prevStep() {
    this.currentStep.update(value => value - 1);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    }
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.profileForm.valid && this.credsForm.valid) {
      const formData = { ...this.credsForm.value, ...this.profileForm.value };

      this.accountService.register(formData).subscribe({
        next: () => {
          this.toggleRegisterMode.emit();
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.validationsErrors.set(error);
        }
      });
    }
  }

  cancel() {
    this.creds = { displayName: '', email: '', password: '', gender: '', dateOfBirth: '', city: '', country: '' };
    this.toggleRegisterMode.emit();
  }
}
