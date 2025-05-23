import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static onlyLetters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[A-Za-zÀ-ÿ\s]+$/.test(control.value);
      return valid ? null : { onlyLetters: true };
    };
  }

  static validPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[0-9]{8,15}$/.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
      return valid ? null : { weakPassword: true };
    };
  }

}
