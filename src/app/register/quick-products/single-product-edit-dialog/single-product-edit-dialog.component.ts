import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, RegisterQuickProduct, QuickProductColors } from 'pos-models';

@Component({
  selector: 'app-single-product-edit-dialog',
  templateUrl: './single-product-edit-dialog.component.html',
  styleUrls: ['./single-product-edit-dialog.component.scss']
})
export class SingleProductEditDialogComponent {
  public quickProduct: RegisterQuickProduct;
  public product: Product;
  public colors: string[] = QuickProductColors;

  constructor(public dialogRef: MatDialogRef<SingleProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.quickProduct = data.quickProduct;
    this.product = data.product;
  }

  onColorClick(color: string): void {
    this.quickProduct.background = color;
  }
}
