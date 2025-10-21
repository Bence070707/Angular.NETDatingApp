import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from "../member-card/member-card";
import { isNgContainer } from '@angular/compiler';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginaterdResult = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 5;
  protected pageSize = 5;

  tabs = [
    { label: 'Liked', predicate: 'liked' },
    { label: 'Liked me', predicate: 'likedBy' },
    { label: 'Mutual Likes', predicate: 'mutualLikes' }
  ]

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: members => {
        this.paginaterdResult.set(members);
      }
    });
  }

  onPageChange(event: {pageNumber: number, pageSize: number}){
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadLikes();
  }
}
