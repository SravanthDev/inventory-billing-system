import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public bill: any) {}

  printBill(): void {
    window.print();
  }
}

