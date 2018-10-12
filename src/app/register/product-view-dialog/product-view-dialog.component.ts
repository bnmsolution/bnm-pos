import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Product} from 'pos-models';

@Component({
  selector: 'app-product-view-dialog',
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductViewDialogComponent {
  product: Product;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.product = data.product;
  }
}
