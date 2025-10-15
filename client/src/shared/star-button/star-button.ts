import { Component, computed, inject, input, output } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Photo } from '../../types/photo';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton {
  public disabled = input<boolean>();
  public selected = input<boolean>();
  clickEvent = output<Event>();

  onClick(event: Event){
    this.clickEvent.emit(event);
  }

}
