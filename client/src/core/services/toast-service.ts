import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
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

  private createToastElement(message: string, type: 'alert-success' | 'alert-error' | 'alert-info' | 'alert-warning') {
    const toast = document.createElement('div');
    toast.classList.add('alert', type, 'shadow-lg');
    const toastContainer = document.getElementById('toast-container');
    toast.innerHTML = `
        <span>${message}</span>
    `;
    if(toastContainer){
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

  }

  showSuccess(message: string) {
    this.createToastElement(message, 'alert-success');
  }

  showError(message: string) {
    this.createToastElement(message, 'alert-error');
  }

  showInfo(message: string) {
    this.createToastElement(message, 'alert-info');
  }

  showWarning(message: string) {
    this.createToastElement(message, 'alert-warning');
  }
}
