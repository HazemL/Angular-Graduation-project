import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { BasicInfoComponent } from "./components/craftsman-registration/basic-info/basic-info";
import { SearchResultsComponent } from "./components/craftsmen-search/search-results/search-results";
import { ReportFormComponent } from "./components/report-submission/report-form/report-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, BasicInfoComponent, SearchResultsComponent, ReportFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('test-Project');
}
