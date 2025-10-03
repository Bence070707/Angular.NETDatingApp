import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private readonly url = 'https://localhost:5108';
  protected readonly title = signal('Dating app');
  protected members: any = signal([]);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get(`${this.url}/api/members`).subscribe({
      next: response => {this.members.set(response); console.log(response)},
      error: err => console.log(err),
      complete: () => console.log('Request completed'),
    });
  }
}
