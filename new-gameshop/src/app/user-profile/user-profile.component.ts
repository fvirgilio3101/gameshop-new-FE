import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, of } from 'rxjs';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports:[FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private readonly service = inject(AuthService);

  user: User | null = null;
  errorMessage = '';
  selectedSection: 'profile' | 'security' = 'profile';

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
        if (data) this.user = data;
      });
  }

  setSection(section: 'profile' | 'security') {
    this.selectedSection = section;
  }

  saveUserData() {
    // Logica per salvare i dati del profilo
  }

  updateEmailPassword() {
    // Logica per aggiornare email e password
  }
}
