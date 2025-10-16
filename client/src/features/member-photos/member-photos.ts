import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Photo } from '../../types/photo';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from "../../shared/image-upload/image-upload";
import { AccountService } from '../../core/services/account-service';
import { Member } from '../../types/member';
import { StarButton } from "../../shared/star-button/star-button";
import { DeleteButton } from "../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute)
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  protected onUpload(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
        if(!this.memberService.member()?.imageUrl){
          this.setMainLocalPhoto(photo);
        }
      },
      error: (err) => {
        this.loading.set(false)

        console.log("Error uploading photo", err);

      }
    });
  }

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe(
        {
          next: photos => this.photos.set(photos),
          error: err => console.log("Error loading photos", err)
        }
      );
    }
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      }
    });
}

deletePhoto(photoId: number) {
  this.memberService.deletePhoto(photoId).subscribe({
    next: () => {
      this.photos.update(photos => photos.filter(p => p.id !== photoId));
    }
  });
}

  private setMainLocalPhoto(photo: Photo) {
  const currentUser = this.accountService.getCurrentUser();
  if (currentUser) {
    currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser);
    this.memberService.member.update(member => ({
      ...member,
      imageUrl: photo.url
    }) as Member);
  }
}
}
