import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { ActivatedRoute, Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../types/member';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { AgePipe } from '../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected title = signal<string | undefined>("Profile");
  protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member.set(data['member']);
      }
    });
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.subscribe(() => {
      this.title.set(this.route.firstChild?.snapshot?.title);
    });
  }
}
