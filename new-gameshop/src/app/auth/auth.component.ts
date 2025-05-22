import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  username = '';
  password = '';
  errorMessage = '';

  private readonly service = inject(AuthService);

  onSubmit() {
    this.service.login(this.username, this.password).subscribe({
      next: (response) => {
        sessionStorage.setItem('isLoggedIn', 'true');
        this.errorMessage = '';
        window.location.href = '/home';
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide. Riprova';
      },
    });
  }
}
