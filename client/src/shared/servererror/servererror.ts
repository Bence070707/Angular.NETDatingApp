import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../types/error';

@Component({
  selector: 'app-servererror',
  imports: [],
  templateUrl: './servererror.html',
  styleUrl: './servererror.css'
})
export class Servererror {
  private router = inject(Router);
  protected error: ApiError;
  protected showDetails = signal(false);

  constructor(){
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.['error'] || { message: 'Unknown error', statusCode: 500 };
  }

  detailsToggle(){
    this.showDetails.update(s => !s);
  }
}
