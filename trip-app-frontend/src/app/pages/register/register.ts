import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { email, form, FormField, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField, MatIcon],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {


  private readonly authServcie = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  registerData = signal({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

    hidePassword = signal(true);
    hideConfirm = signal(true);

  registerForm = form(this.registerData, schema => {
    email(schema.email, { message: 'Email requis' });
    required(schema.password, { message: 'Mot de passe requis' });
    minLength(schema.password, 8, { message: 'Le mot de passe doit contenir au moins 8 caractères' });
    pattern(schema.password, /^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre' });
    required(schema.displayName, { message: 'Pseudo requis' });
    validate(schema.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schema.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Les mots de passe ne correspondent pas',
        };
      }
      return null;
    });

  });

  onSubmit() {
    submit(this.registerForm, async () => {
      this.status.set('submitting');
      this.snackBar.open('Inscription en cours...', 'Fermer');
      var data = {
        email: this.registerData().email,
        password: this.registerData().password,
        displayName: this.registerData().displayName
      };
      this.authServcie.register(data).subscribe({
        next: () => {
          this.status.set('success');
          this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 2000 });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          this.status.set('error');
          this.snackBar.open('Une erreur est survenue lors de l\'inscription', 'Fermer', { duration: 2000 });
        }
      });
    });
  }

}