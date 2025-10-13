import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-testerrors',
  imports: [],
  templateUrl: './testerrors.html',
  styleUrl: './testerrors.css'
})
export class Testerrors {
  private http = inject(HttpClient);
  private url = 'https://localhost:5108/api/';
  protected validationErrors = signal<string[]>([]);

  get401Error(){
    this.http.get(this.url + 'error/auth').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400error(){
    this.http.get(this.url + 'error/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get500Error(){
    this.http.get(this.url + 'error/server').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get404Error(){
    this.http.get(this.url + 'error/notfound').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

  get400ValidationError(){
    this.http.post(this.url + 'account/register', {}).subscribe({
      next: response => console.log(response),
      error: error => { 
        console.log(error);
        this.validationErrors.set(error);
      }
    });
  }
}
