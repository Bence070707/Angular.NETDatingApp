import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { ActivatedRoute, Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouterLink } from "@angular/router";
import { AgePipe } from '../../core/pipes/age-pipe';
import { AccountService } from '../../core/services/account-service';
import { Location } from '@angular/common';
import { PresenceService } from '../../core/services/presence-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location)
  protected title = signal<string | undefined>("Profile");
  protected presenceService = inject(PresenceService);
  protected isCurrentUser = computed(()=>{
    return this.accountService.getCurrentUser()?.id === this.route.snapshot?.paramMap.get('id');
  })

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
