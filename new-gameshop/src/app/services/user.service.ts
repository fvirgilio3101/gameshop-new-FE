import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class UserService{


  private readonly http = inject(HttpClient);

  baseUrl = 'http://localhost:8082/it.ecubit.gameshop/api/user';

  private readonly user_ = signal<User | null>(null);


  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/me/upload-profile-image`, formData,{withCredentials:true});
  }



  getProfileImage(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/me/profile-image`, {
      responseType: 'blob',
      withCredentials:true
    });
  }

  updateCredentials(data: { email?: string; password?: string }) {
    return this.http.put(`${this.baseUrl}/me/update-credentials`, data, {
      withCredentials: true,
      responseType: 'text'
    });
}
}
