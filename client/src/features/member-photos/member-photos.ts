import { Component, inject, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Photo } from '../../types/photo';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute)
  protected photos$ = new Observable<Photo[]>();

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }

  get photoMocks(){
    return Array.from({length: 20}, (_, i) => ({id: i, url: `https://picsum.photos/200/200?random=${i}`}));
  }
}
