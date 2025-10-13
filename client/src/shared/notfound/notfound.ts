import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-notfound',
  imports: [],
  templateUrl: './notfound.html',
  styleUrl: './notfound.css'
})
export class Notfound {
  private location = inject(Location);

  goBack(){
    this.location.back();
  }

}
