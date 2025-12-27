import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly title = signal('test-Project');
  protected readonly showMainNavbar = signal(true);
  protected readonly showFooter = signal(true);

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
