import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-product-view-dialog',
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.scss']
})
export class ProductViewDialogComponent {
  public product;

  constructor( @Inject(MAT_DIALOG_DATA) data: any) {
    this.product = data.product;
    console.log(this.product);
  }
}
