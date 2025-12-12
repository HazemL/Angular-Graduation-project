<<<<<<< HEAD
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
=======
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
>>>>>>> 7e1f683aff7da544e1f1cf5f92fd37aa01125cfb
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { BasicInfoComponent } from "./components/craftsman-registration/basic-info/basic-info";
import { SearchResultsComponent } from "./components/craftsmen-search/search-results/search-results";
import { ReportFormComponent } from "./components/report-submission/report-form/report-form";
<<<<<<< HEAD
import { filter } from 'rxjs';
=======
>>>>>>> 7e1f683aff7da544e1f1cf5f92fd37aa01125cfb

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, BasicInfoComponent, SearchResultsComponent, ReportFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
<<<<<<< HEAD
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly title = signal('test-Project');
  protected readonly showMainNavbar = signal(true);

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
    const hideNavbarRoutes = ['/register/craftsman', '/report'];
    this.showMainNavbar.set(!hideNavbarRoutes.some(route => url.includes(route)));
  }
=======
export class App {
  protected readonly title = signal('test-Project');
>>>>>>> 7e1f683aff7da544e1f1cf5f92fd37aa01125cfb
}
