import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../utilities/custom.validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage = '';

  private readonly router = inject(Router);
  private readonly service = inject(AuthService);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
      this.registerForm = new FormGroup({
         name: new FormControl('', [Validators.required, CustomValidators.onlyLetters()]),
          surname: new FormControl('', [Validators.required, CustomValidators.onlyLetters()]),
          email: new FormControl('', [Validators.required, Validators.email]),
          username: new FormControl('', Validators.required),
          password: new FormControl('', [Validators.required, CustomValidators.strongPassword()]),
          address: new FormControl('', Validators.required),
          phone_number: new FormControl('', [Validators.required, CustomValidators.validPhone()])
      });
    }

  onSubmit() {
    this.service.register(this.registerForm.value)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Errore durante la registrazione. Riprova.';
          console.error('Errore nella registrazione', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Registrazione avvenuta con successo', response);
          this.router.navigate(['/login']);
        }
      });
  }
}
