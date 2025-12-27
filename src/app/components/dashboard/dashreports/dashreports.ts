import { Component } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-dashreports',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashreports.html',
  styleUrl: './dashreports.css',
})
export class Dashreports implements OnInit {
 reports: any[] = [];
  filteredReports: any[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.reportsService.getReports().subscribe({
      next: (res) => {
        this.reports = res;
        this.filteredReports = this.reports;
      },
      error: (err) => console.error('Error fetching reports:', err)
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredReports = this.reports;
    } else {
      this.filteredReports = this.reports.filter(report =>
        report.message?.toLowerCase().includes(term) ||
        report.status?.toLowerCase().includes(term) ||
        report.reporterName?.toLowerCase().includes(term) ||
        report.craftsmanName?.toLowerCase().includes(term)
      );
    }
  }
}
