import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { form, email, submit, FormField, required } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  credentials = signal({
    email: '',
    password: ''
  });
  status = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  loginForm = form(this.credentials, schema => {
    email(schema.email, { message: 'Email is required' });
    required(schema.password, { message: 'Password is required' });
  });

  onSubmit() {
    submit(this.loginForm, async () => {
      this.status.set('submitting');
      this.snackBar.open('Submitting credentials...', 'Close');
      this.authService.login(this.credentials().email, this.credentials().password).subscribe({
        next: () => {
          this.status.set('success');
          this.snackBar.open('Logged in successfully', 'Close', { duration: 2000 });
          setTimeout(() => {
            this.router.navigate(['/trips']);
          }, 2000);
        },
        error: () => {
          this.status.set('error');
          this.snackBar.open('Logged in failed', 'Close', { duration: 2000 });
        }
      });
    });
  }
}
