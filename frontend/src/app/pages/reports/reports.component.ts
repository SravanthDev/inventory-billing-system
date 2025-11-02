import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  loading = false;
  stats: any = {};
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Top Products Chart
  topProductsChartType: ChartType = 'bar';
  topProductsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Revenue (₹)',
      data: [],
      backgroundColor: '#3f51b5'
    }]
  };
  topProductsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    const filters: any = {};
    if (this.startDate) {
      filters.startDate = this.startDate.toISOString().split('T')[0];
    }
    if (this.endDate) {
      filters.endDate = this.endDate.toISOString().split('T')[0];
    }

    this.apiService.getSalesStats(filters).subscribe({
      next: (data) => {
        this.stats = data.stats || {};
        this.updateTopProductsChart(data.topProducts || []);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load reports', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  updateTopProductsChart(topProducts: any[]): void {
    this.topProductsChartData = {
      labels: topProducts.map(p => p.productName || 'Unknown'),
      datasets: [{
        label: 'Revenue (₹)',
        data: topProducts.map(p => p.totalRevenue || 0),
        backgroundColor: '#3f51b5'
      }]
    };
  }

  applyDateFilter(): void {
    this.loadReports();
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadReports();
  }

  exportToCSV(): void {
    // Simple CSV export implementation
    const csvData = this.convertToCSV(this.stats);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue', `₹${data.totalRevenue || 0}`],
      ['Total Bills', data.totalBills || 0],
      ['Average Bill', `₹${data.averageBill || 0}`],
      ['Total Tax', `₹${data.totalTax || 0}`],
      ['Total Discount', `₹${data.totalDiscount || 0}`]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

