import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { BasicInfoComponent } from "./components/craftsman-registration/basic-info/basic-info";
import { SearchResultsComponent } from "./components/craftsmen-search/search-results/search-results";
import { ReportFormComponent } from "./components/report-submission/report-form/report-form";
import { ConfirmationComponent } from "./components/subscription-plans/confirmation/confirmation";
import { PricingPageComponent } from "./components/subscription-plans/pricing-page/pricing-page";
import { ReviewsPageComponent } from "./components/reviews-management/reviews-page/reviews-page";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, BasicInfoComponent, SearchResultsComponent, ReportFormComponent, ConfirmationComponent, PricingPageComponent, ReviewsPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-Project');
}
