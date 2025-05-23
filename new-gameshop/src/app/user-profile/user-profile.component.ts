import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { NavbarComponent } from '../navbar/navbar.component'; // Standalone anche lui

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private readonly service = inject(AuthService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly profileService = inject(UserService);

  user!: User;
  errorMessage = '';
  successMessage = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  selectedSection: 'profile' | 'security' = 'profile';
  profileForm!: FormGroup;

  profileImageUrl = computed(() => this.profileService.profileImageUrl());
  uploadMessage = this.profileService.uploadMessage;


  ngOnInit(): void {
    this.service.getUserDetails()
      .pipe(
        catchError((err) => {
          this.errorMessage = 'Errore durante il recupero dei dati utente';
          console.error(err);
          return of(null);
        })
      )
      .subscribe((data: User | null) => {
        if (data) {
          this.user = data;
          this.newEmail = data.email;
          this.initForm(data);
          this.loadProfileImage();
        }
      });
  }

  private initForm(user: User) {
    this.profileForm = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      surname: new FormControl(user.surname, Validators.required),
      username: new FormControl(user.username, Validators.required),
      address: new FormControl(user.address, Validators.required),
      phone_number: new FormControl(user.phone_number, Validators.required)
    });
  }

  loadProfileImage() {
    this.profileService.getProfileImage().subscribe({
      next: (url) => {
        const oldUrl = this.profileService.profileImageUrl();
        if (oldUrl) URL.revokeObjectURL(oldUrl);  // Libera il blob precedente
        this.profileService.profileImageUrl.set(url);
      },
      error: () => {
        this.profileService.uploadMessage.set({
          type: 'error',
          text: 'Errore nel caricamento dell\'immagine profilo.'
        });
        this.profileService.clearUploadMessageAfterDelay();
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profileService.uploadProfileImage(file).subscribe({
        next: () => {
          this.profileService.uploadMessage.set({
            type: 'success',
            text: 'Immagine del profilo aggiornata con successo!'
          });
          this.loadProfileImage();  // Aggiorna l'immagine
          this.profileService.clearUploadMessageAfterDelay();
        },
        error: (err) => {
          console.error('Upload error', err);
          this.profileService.uploadMessage.set({
            type: 'error',
            text: 'Errore durante il caricamento dell\'immagine.'
          });
          this.profileService.clearUploadMessageAfterDelay();
        }
      });
    }
  }

  setSection(section: 'profile' | 'security') {
    this.selectedSection = section;
  }

  saveUserData() {
    // Logica per salvare i dati del profilo
    console.log(this.profileForm.value);
  }

  updateEmailPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Le password non corrispondono.';
      return;
    }

    const updateData: { email?: string; password?: string } = {};
    if (this.newEmail && this.newEmail !== this.user?.email) {
      updateData.email = this.newEmail;
    }
    if (this.newPassword) {
      updateData.password = this.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      this.errorMessage = 'Nessuna modifica da salvare.';
      return;
    }

    this.profileService.updateCredentials(updateData)
      .pipe(
        catchError((err) => {
          this.errorMessage = 'Errore durante l\'aggiornamento delle credenziali';
          console.error(err);
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.successMessage = 'Credenziali aggiornate con successo!';
          if (updateData.email) {
            if (this.user) this.user.email = updateData.email;
          }
          this.newPassword = '';
          this.confirmPassword = '';
        }
      });
  }
}
