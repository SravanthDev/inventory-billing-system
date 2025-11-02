import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { BillDetailComponent } from '../../components/bill-detail/bill-detail.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['customerId', 'name', 'email', 'phone', 'totalPurchases', 'totalSpent', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.apiService.getCustomers(this.searchTerm).subscribe({
      next: (customers) => {
        this.dataSource.data = customers;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.snackBar.open('Failed to load customers', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  openCustomerForm(customer?: any): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '600px',
      data: customer || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCustomers();
      }
    });
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.apiService.deleteCustomer(id).subscribe({
        next: () => {
          this.snackBar.open('Customer deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.loadCustomers();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete customer', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  viewHistory(customer: any): void {
    this.apiService.getCustomerHistory(customer._id).subscribe({
      next: (bills) => {
        if (bills.length > 0) {
          // Show first bill as example, you can create a list view if needed
          this.dialog.open(BillDetailComponent, {
            width: '600px',
            data: bills[0]
          });
        } else {
          this.snackBar.open('No purchase history found', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to load customer history', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  searchCustomers(): void {
    this.loadCustomers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadCustomers();
  }
}

