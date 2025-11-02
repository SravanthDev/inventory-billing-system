import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface BillItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  products: any[] = [];
  customers: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: BillItem[] = [];
  selectedCustomer: any = null;
  
  billingForm: FormGroup;
  searchTerm = '';
  taxRate = 0;
  discount = 0;
  paymentMethod = 'cash';

  subtotal = 0;
  taxAmount = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.billingForm = this.fb.group({
      customer: [null],
      taxRate: [0],
      discount: [0],
      paymentMethod: ['cash']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
    this.billingForm.valueChanges.subscribe(() => {
      this.updateTotals();
    });
  }

  loadProducts(): void {
    this.apiService.getProducts({ available: 'true' }).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
      },
      error: (error) => {
        this.snackBar.open('Failed to load products', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  loadCustomers(): void {
    this.apiService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      }
    });
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.productId.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addToCart(product: any): void {
    const existingItem = this.selectedProducts.find(item => item.product === product._id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        this.snackBar.open('Insufficient stock', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    } else {
      if (product.stock > 0) {
        this.selectedProducts.push({
          product: product._id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          subtotal: product.price
        });
      } else {
        this.snackBar.open('Product out of stock', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    }
    
    this.updateTotals();
  }

  removeFromCart(index: number): void {
    this.selectedProducts.splice(index, 1);
    this.updateTotals();
  }

  updateQuantity(item: BillItem, change: number): void {
    const product = this.products.find(p => p._id === item.product);
    if (product) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        this.removeFromCart(this.selectedProducts.indexOf(item));
      } else if (newQuantity > product.stock) {
        this.snackBar.open('Insufficient stock', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      } else {
        item.quantity = newQuantity;
        item.subtotal = item.quantity * item.price;
        this.updateTotals();
      }
    }
  }

  updateTotals(): void {
    this.subtotal = this.selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);
    this.taxRate = this.billingForm.get('taxRate')?.value || 0;
    this.discount = this.billingForm.get('discount')?.value || 0;
    this.taxAmount = (this.subtotal - this.discount) * (this.taxRate / 100);
    this.total = this.subtotal - this.discount + this.taxAmount;
  }

  createBill(): void {
    if (this.selectedProducts.length === 0) {
      this.snackBar.open('Please add at least one product', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const billData = {
      items: this.selectedProducts.map(item => ({
        product: item.product,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      customer: this.billingForm.get('customer')?.value || null,
      taxRate: this.taxRate,
      discount: this.discount,
      paymentMethod: this.billingForm.get('paymentMethod')?.value || 'cash'
    };

    this.apiService.createBill(billData).subscribe({
      next: (bill) => {
        this.snackBar.open('Bill created successfully', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.resetForm();
        this.router.navigate(['/bills']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to create bill', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  resetForm(): void {
    this.selectedProducts = [];
    this.selectedCustomer = null;
    this.billingForm.reset({
      customer: null,
      taxRate: 0,
      discount: 0,
      paymentMethod: 'cash'
    });
    this.updateTotals();
  }
}

