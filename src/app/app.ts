import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { filter } from 'rxjs';
import { Login } from "./components/login/login";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly title = signal('test-Project');
  protected readonly showMainNavbar = signal(true);
  protected readonly showFooter = signal(true);
constructor(private authService: AuthService) {
    if (localStorage.getItem('auth_token')) {
      this.authService.loadCurrentUser().subscribe();
    }
  }
  ngOnInit() {
    // Check initial route
    this.checkRoute(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
      });
  }
  

  private checkRoute(url: string): void {
    const hideNavbarRoutes = ['/register/craftsman', '/report', '/dashboard', '/craftsman-dashboard', '/craftsman-profile'];
    this.showMainNavbar.set(!hideNavbarRoutes.some(route => url.includes(route)));
    this.showFooter.set(!hideNavbarRoutes.some(route => url.includes(route)));
  }
}
