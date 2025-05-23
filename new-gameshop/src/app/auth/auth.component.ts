import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  username = '';
  password = '';
  errorMessage = '';

  private readonly service = inject(AuthService);
  private readonly router = inject(Router);

  onSubmit() {
    this.service.login(this.username, this.password).subscribe({
      next: (response) => {
        sessionStorage.setItem('isLoggedIn', 'true');
        this.errorMessage = '';
        this.router.navigate([ '/home']);
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide. Riprova';
      },
    });
  }
}
