import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { BillDetailComponent } from '../../components/bill-detail/bill-detail.component';

@Component({
  selector: 'app-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss']
})
export class BillsListComponent implements OnInit {
  displayedColumns: string[] = ['billNumber', 'date', 'customer', 'itemsCount', 'total', 'paymentMethod', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBills();
    // Add delete column if admin
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('delete');
    }
  }

  loadBills(): void {
    const filters: any = {};
    if (this.startDate) {
      filters.startDate = this.startDate.toISOString().split('T')[0];
    }
    if (this.endDate) {
      filters.endDate = this.endDate.toISOString().split('T')[0];
    }

    this.apiService.getBills(filters).subscribe({
      next: (bills) => {
        this.dataSource.data = bills;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.snackBar.open('Failed to load bills', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  viewBill(bill: any): void {
    this.dialog.open(BillDetailComponent, {
      width: '600px',
      data: bill
    });
  }

  deleteBill(id: string): void {
    if (confirm('Are you sure you want to delete this bill? This will restore product stock.')) {
      this.apiService.deleteBill(id).subscribe({
        next: () => {
          this.snackBar.open('Bill deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.loadBills();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete bill', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  applyDateFilter(): void {
    this.loadBills();
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadBills();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}

