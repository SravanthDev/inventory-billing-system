import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [10, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.data) {
      this.isEdit = true;
      this.productForm.patchValue(this.data);
    }
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.isEdit) {
        this.apiService.updateProduct(this.data._id, productData).subscribe({
          next: () => {
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to update product', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      } else {
        this.apiService.createProduct(productData).subscribe({
          next: () => {
            this.snackBar.open('Product created successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to create product', 'Close', {
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

