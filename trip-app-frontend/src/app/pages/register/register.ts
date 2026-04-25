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
    email(schema.email, { message: 'Email is required' });
    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, { message: 'Password must be at least 8 characters long' });
    pattern(schema.password, /^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password must contain at least one uppercase letter and one number' });
    required(schema.displayName, { message: 'Pseudo is required' });
    validate(schema.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schema.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });

  });

  onSubmit() {
    submit(this.registerForm, async () => {
      this.status.set('submitting');
      this.snackBar.open('Submitting register...', 'Close');
      var data = {
        email: this.registerData().email,
        password: this.registerData().password,
        displayName: this.registerData().displayName
      };
      this.authServcie.register(data).subscribe({
        next: () => {
          this.status.set('success');
          this.snackBar.open('Register submitted successfully', 'Close', { duration: 2000 });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          this.status.set('error');
          this.snackBar.open('Error submitting register', 'Close', { duration: 2000 });
        }
      });
    });
  }

}
