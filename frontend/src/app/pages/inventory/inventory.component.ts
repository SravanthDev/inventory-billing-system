import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  products: any[] = [];
  lowStockProducts: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  loading = true;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadLowStockProducts();
    this.loadCategories();
  }

  loadInventory(): void {
    this.loading = true;
    const filters: any = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.apiService.getProducts(filters).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load inventory', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  loadLowStockProducts(): void {
    this.apiService.getLowStockProducts().subscribe({
      next: (products) => {
        this.lowStockProducts = products;
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  applyFilter(): void {
    this.loadInventory();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.loadInventory();
  }

  isLowStock(stock: number, reorderLevel: number): boolean {
    return stock <= reorderLevel;
  }

  getStockStatusColor(stock: number, reorderLevel: number): string {
    if (stock === 0) return 'warn';
    if (stock <= reorderLevel) return 'accent';
    return 'primary';
  }
}

