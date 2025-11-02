import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.customerForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      
      if (this.isEdit) {
        this.apiService.updateCustomer(this.data._id, customerData).subscribe({
          next: () => {
            this.snackBar.open('Customer updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to update customer', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      } else {
        this.apiService.createCustomer(customerData).subscribe({
          next: () => {
            this.snackBar.open('Customer created successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to create customer', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

