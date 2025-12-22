import { Component } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashreports',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashreports.html',
  styleUrl: './dashreports.css',
})
export class Dashreports {
  reports: any[] = [];
  filteredReports: any[] = [];
  loading = true;
  searchTerm: string = '';
  
  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.reportsService.getAllReports().subscribe({
      next: (reports: any) => {
        this.reports = Array.isArray(reports) ? reports : (reports?.data ?? []);
        this.filteredReports = this.reports;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  changeStatus(reportId: string, status: string) {
    this.reportsService.updateReportStatus(reportId, status as any)
      .subscribe(() => this.loadReports());
  }
  
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredReports = this.reports;
    } else {
      this.filteredReports = this.reports.filter(report => 
        report.user?.name?.toLowerCase().includes(term) || 
        report.type?.name?.toLowerCase().includes(term) ||
        report.description?.toLowerCase().includes(term)
      );
    }
  }
}
