import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterLink,RouterOutlet],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isDarkMode = signal<boolean>(false);

  constructor(public authService: AuthService) {
    // Initialize dark mode from current theme
    if (document.documentElement.classList.contains('dark')) {
      this.isDarkMode.set(true);
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(value => !value);
    const html = document.documentElement;
    if (this.isDarkMode()) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  onCreateAccount(): void {
    console.log('Create account clicked');
    
  }

  onLogin(): void {
    console.log('Login clicked');
    
  }
  logout() {
  this.authService.logout();
}
}
