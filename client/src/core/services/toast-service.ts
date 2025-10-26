import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private router = inject(Router);
  constructor() {
    this.createToastContainer();
  }

  private createToastContainer(){
    let container = document.getElementById('toast-container');
    if(!container){
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }

  private createToastElement(message: string, type: 'alert-success' | 'alert-error' | 'alert-info' | 'alert-warning', avatar?: string, route?: string) {
    const toast = document.createElement('div');
    toast.classList.add('alert', type, 'shadow-lg', 'flex', 'items-center', 'gap-3', 'cursor-pointer');
    const toastContainer = document.getElementById('toast-container');
    if(route){
      toast.addEventListener('click', () => {this.router.navigateByUrl(route!);});
    }
    toast.innerHTML = `
    ${avatar ? `<img src=${avatar} || '/user.png' class='w-10 h-10 rounded'` : ''}
        <span>${message}</span>
    `;
    if(toastContainer){
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 10000);
    }

  }

  showSuccess(message: string, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-success', avatar, route);
  }

  showError(message: string, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-error', avatar, route);
  }

  showInfo(message: string, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-info', avatar, route);
  }

  showWarning(message: string, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-warning', avatar, route);
  }
}
