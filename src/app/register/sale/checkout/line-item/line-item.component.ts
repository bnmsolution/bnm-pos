import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { RegisterSaleLineItem, RegisterSale, DiscountType, DiscountMethod, DiscountCalculateMethod } from 'pos-models';

import { ProductService } from 'src/app/core';
import { ProductViewDialogComponent } from '../../../product-view-dialog/product-view-dialog.component';
import { AppCurrencyPipe } from 'src/app/shared';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppCurrencyPipe]
})
export class LineItemComponent implements OnInit {
  @Input() lineItem: RegisterSaleLineItem;
  @Input() isOpen: boolean;
  @Input() isReturn = false;
  @Input() maxReturnQuantity: number;
  @Output() lineItemClick = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() updateAddons = new EventEmitter();

  discountTypes = DiscountType;
  discountCalculateMethods = DiscountCalculateMethod;
  lineItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private productService: ProductService,
    private currencyPipe: AppCurrencyPipe) {
  }

  ngOnInit() {
  }

  handleClick() {
    this.lineItemClick.emit({ id: this.lineItem.id });
  }

  handleRemoveClick(event) {
    // prevent click event
    event.stopPropagation();
    this.remove.emit({ id: this.lineItem.id });
  }

  openProductViewDialog() {
    this.productService.getProductById(this.lineItem.productId)
      .subscribe(product => {
        const data = {
          product,
          lineItem: this.lineItem,
          addons: []
        };
        this.dialog.open(ProductViewDialogComponent, {
          width: '350px',
          data,
          autoFocus: false
        });
      });
  }

  get discountLabels() {
    return this.lineItem.discounts.map(discount => {
      const { type, name, method, calculateMethod, amount, percentage } = discount;
      if (type === DiscountType.Promotion) {

      }

      if (type === DiscountType.LineItemDiscount) {
        if (method === DiscountMethod.FixedAmount) {
          if (calculateMethod === DiscountCalculateMethod.ApplyToEachQuantity) {
            return `개별 할인 ${this.currencyPipe.transform(amount)}x${this.lineItem.quantity}
             -${this.currencyPipe.transform(amount * this.lineItem.quantity)}`;
          } else {
            return `전체 할인 -${this.currencyPipe.transform(amount)}`;
          }
        } else {
          const discountAmount = calculateMethod === DiscountCalculateMethod.ApplyToEachQuantity ?
            amount * this.lineItem.quantity : amount;
          return `할인 ${percentage}% -${this.currencyPipe.transform(discountAmount)}`;
        }
      }
    });
  }
}
