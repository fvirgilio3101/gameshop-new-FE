import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { User } from "../models/user";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class UserService{


  private readonly http = inject(HttpClient);

  baseUrl = 'http://localhost:8082/it.ecubit.gameshop/api/user';
  profileImageUrl: WritableSignal<string | null> = signal(null);
  uploadMessage: WritableSignal<{ type: 'success' | 'error'; text: string } | null> = signal(null);

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/me/upload-profile-image`, formData, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  getProfileImage(): Observable<string> {
    return this.http.get(`${this.baseUrl}/me/profile-image`, {
      responseType: 'blob',
      withCredentials: true
    }).pipe(
      map(blob => {
        const objectUrl = URL.createObjectURL(blob);
        return objectUrl;
      })
    );
  }

  clearUploadMessageAfterDelay(delayMs: number = 3000) {
    setTimeout(() => {
      this.uploadMessage.set(null);
    }, delayMs);
  }

  updateCredentials(data: { email?: string; password?: string }) {
    return this.http.put(`${this.baseUrl}/me/update-credentials`, data, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
