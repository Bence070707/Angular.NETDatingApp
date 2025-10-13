import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../../types/member';
import { AccountService } from './account-service';
import { Photo } from '../../types/photo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private accountService = inject(AccountService);

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }
  getMember(id: string){
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }
  getMemberPhotos(id: string){
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }
}
