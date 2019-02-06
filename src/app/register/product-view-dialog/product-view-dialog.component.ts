import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Product, ProductAddon, getConcatenatedVariantName } from 'pos-models';
import { Store } from '@ngrx/store';

import * as registerSaleActions from '../../stores/actions/register-sale.actions';

@Component({
  selector: 'app-product-view-dialog',
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductViewDialogComponent {
  product: Product;
  variantId: string;
  checked = false;
  addons: ProductAddon[] = [];
  quantity: number;

  get productName(): string {
    const { name, variants } = this.product;
    if (this.variantId) {
      const variant = variants.find(v => v.id === this.variantId);
      return `${name} ${getConcatenatedVariantName(variant)}`;
    } else {
      return name;
    }
  }

  get productPrice(): number {
    const { retailPrice, variants } = this.product;
    if (this.variantId) {
      const variant = variants.find(v => v.id === this.variantId);
      return variant.retailPrice;
    } else {
      return retailPrice;
    }
  }

  constructor(
    private store: Store<any>,
    private dialogRef: MatDialogRef<ProductViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.product = data.product;
    this.variantId = data.lineItem.variantId;
    this.quantity = data.lineItem.quantity;
    this.addons = this.product.addons.map(a => Object.assign({}, a));
    this.addons.forEach((a: any) => {
      if (data.lineItem.addons.find(lineItemAddon => lineItemAddon.name === a.name)) {
        a.value = true;
      }
    });
    data.addons = this.addons;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
      this.updateLineItem();
    }
  }

  increaseQuantity() {
    this.quantity++;
    this.updateLineItem();
  }

  updateLineItem() {
    const { id, retailPrice, discountRate } = this.data.lineItem;
    this.store.dispatch(new registerSaleActions.UpdateLineItem(
      { id, quantity: this.quantity, retailPrice, discountRate }));
  }
}
