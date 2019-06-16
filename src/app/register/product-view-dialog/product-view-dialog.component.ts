import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatNumber } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {
  Product, ProductAddon, getConcatenatedVariantName, Discount,
  RegisterSaleLineItem, DiscountType, DiscountMethod, DiscountCalculateMethod, RegisterSale, Register
} from 'pos-models';
import { Store } from '@ngrx/store';

import * as registerSaleActions from 'src/app/stores/actions/register-sale.actions';
import { cloneDeep } from 'src/app/shared/utils/lang';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-view-dialog',
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state('closed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('open', style({ height: '*' })),
      transition('open <=> closed', [
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class ProductViewDialogComponent implements OnDestroy {
  product: Product;
  variantId: string;
  checked = false;
  addons: ProductAddon[] = [];
  quantity: number;
  showDiscountInputs = false;
  lineItem: RegisterSaleLineItem;
  lineItemDiscount: Discount;
  discountMethods = DiscountMethod;
  calculateMethods = DiscountCalculateMethod;
  saleSubscription: Subscription;

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

  get discountString(): string {
    const { method, amount, percentage, calculateMethod } = this.lineItemDiscount;
    if (method === DiscountMethod.FixedAmount) {
      return `할인 ${formatNumber(amount, 'kr')}`;
    } else {
      return `할인 ${percentage}%`;
    }
  }

  constructor(
    private store: Store<any>,
    private dialogRef: MatDialogRef<ProductViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.product = data.product;
    // this.lineItem = data.lineItem;
    // this.lineItemDiscount = data.lineItem.discounts.find(d => d.type === DiscountType.LineItemDiscount);
    this.addons = this.product.addons.map(a => Object.assign({}, a));


    this.saleSubscription = this.store.select('registerSale')
      .subscribe((sale: RegisterSale) => {
        this.lineItem = sale.lineItems.find(li => li.id === data.lineItem.id);
        this.lineItemDiscount = this.lineItem.discounts.find(d => d.type === DiscountType.LineItemDiscount);
        this.variantId = this.lineItem.variantId;
        this.quantity = this.lineItem.quantity;
        this.addons.forEach((a: any) => {
          if (this.lineItem.addons.find(lineItemAddon => lineItemAddon.name === a.name)) {
            a.value = true;
          }
        });
      });
  }

  ngOnDestroy() {
    this.saleSubscription.unsubscribe();
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
      this.updateQuantity();
    }
  }

  increaseQuantity() {
    this.quantity++;
    this.updateQuantity();
  }

  quantityInputChange(quantity: number) {
    this.quantity = quantity;
    this.updateQuantity();
  }

  updateQuantity() {
    this.store.dispatch(new registerSaleActions.UpdateLineItemQuantity(
      { id: this.data.lineItem.id, quantity: this.quantity }));
  }

  updateAddons(index: number) {
    this.addons[index].value = !this.addons[index].value;
    this.store.dispatch(new registerSaleActions.UpdateAddons({ id: this.data.lineItem.id, addons: cloneDeep(this.addons) }));
  }

  addDiscount(discount: Discount) {
    const payload = { id: this.data.lineItem.id, ...discount };
    this.store.dispatch(new registerSaleActions.AddLineItemDiscount(payload));
    this.showDiscountInputs = false;
  }

  removeDiscount() {
    this.store.dispatch(new registerSaleActions.RemoveLineItemDiscount({ id: this.data.lineItem.id }));
    this.showDiscountInputs = false;
  }
}
