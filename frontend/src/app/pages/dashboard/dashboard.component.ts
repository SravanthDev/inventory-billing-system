import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  stats: any = {};
  loading = true;

  // Chart configurations
  dailySalesChartType: ChartType = 'line';
  dailySalesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Daily Revenue',
      data: [],
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  dailySalesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return 'Revenue: ₹' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('Dashboard data:', data); // Debug log
        this.stats = data;
        
        if (data.dailySales && data.dailySales.length > 0) {
          this.updateChart(data.dailySales);
        } else {
          console.warn('No daily sales data available');
          // Show empty chart with message
          this.dailySalesChartData = {
            labels: ['No Data'],
            datasets: [{
              label: 'Daily Revenue',
              data: [0],
              borderColor: '#3f51b5',
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              tension: 0.4,
              fill: true
            }]
          };
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Dashboard error:', error); // Debug log
        this.loading = false;
        this.snackBar.open('Failed to load dashboard data', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  updateChart(dailySales: any[]): void {
    console.log('Updating chart with:', dailySales); // Debug log
    
    const labels = dailySales.map(s => {
      const date = new Date(s._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = dailySales.map(s => s.revenue || 0);
    
    this.dailySalesChartData = {
      labels: labels,
      datasets: [{
        label: 'Daily Revenue',
        data: data,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
    
    // Force chart update
    if (this.chart) {
      this.chart.update();
    }
  }
}
