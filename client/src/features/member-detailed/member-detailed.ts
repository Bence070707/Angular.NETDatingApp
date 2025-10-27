import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { ActivatedRoute, Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouterLink } from "@angular/router";
import { AgePipe } from '../../core/pipes/age-pipe';
import { AccountService } from '../../core/services/account-service';
import { Location } from '@angular/common';
import { PresenceService } from '../../core/services/presence-service';
import { LikesService } from '../../core/services/likes-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  protected likesService = inject(LikesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location)
  protected title = signal<string | undefined>("Profile");
  protected presenceService = inject(PresenceService);
  private routeId = signal<string | null>(null);
  protected hasLiked = computed(()=> this.likesService.likeIds().includes(this.routeId()!))
  protected isCurrentUser = computed(()=>{
    return this.accountService.getCurrentUser()?.id === this.routeId();
  })

  constructor(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routeId.set(id);
    });
  }

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.subscribe(() => {
      this.title.set(this.route.firstChild?.snapshot?.title);
    });
  }

  back(){
    this.location.back();
  }
}
