import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'], // صححت typo من styleUrl إلى styleUrls
})
export class Navbar {
  isDarkMode = signal<boolean>(false);

  constructor(public authService: AuthService, private router: Router) {
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
    this.router.navigate(['/register/craftsman']);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

goToDashboard() {
  const user = this.authService.currentUser();

  console.log('USER:', user);

  if (!user) return;

  if (user.role === 'Admin') {
    this.router.navigate(['/dashboard']);
    return;
  }

  if (user.role === 'Craftsman') {
    if (!user.userId) {
      console.error('Craftsman has no userId', user);
      return;
    }
    this.router.navigate(['/craftsman-dashboard', user.userId]);
  }
}





}
