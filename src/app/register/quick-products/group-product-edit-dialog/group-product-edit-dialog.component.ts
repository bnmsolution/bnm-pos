import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegisterQuickProduct, QuickProductColors } from 'pos-models';

@Component({
  selector: 'app-group-product-edit-dialog',
  templateUrl: './group-product-edit-dialog.component.html',
  styleUrls: ['./group-product-edit-dialog.component.scss']
})
export class GroupProductEditDialogComponent {
  public quickProduct: RegisterQuickProduct;
  public colors: string[] = QuickProductColors;

  constructor(public dialogRef: MatDialogRef<GroupProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.quickProduct = data.quickProduct;
  }

  onColorClick(color: string): void {
    this.quickProduct.background = color;
  }
}
