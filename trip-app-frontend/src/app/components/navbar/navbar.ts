import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  user = this.authService.user;

  logout() {
    this.authService?.logout();
    this.router.navigateByUrl('/login');
  }
}
