import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RegisterSale, Discount, DiscountType, RegisterSaleLineItem } from 'pos-models';

import * as registerSaleActions from 'src/app/stores/actions/register-sale.actions';

@Component({
  selector: 'app-discount-dialog',
  templateUrl: './discount-dialog.component.html',
  styleUrls: ['./discount-dialog.component.scss']
})
export class DiscountDialogComponent implements OnDestroy {
  showDiscountInputs = false;
  saleSubscription: Subscription;
  totalLineItemDiscount: number;
  totalDiscount: Discount;

  constructor(
    private store: Store<any>) {

    this.saleSubscription = this.store.select('registerSale')
      .subscribe((sale: RegisterSale) => {
        this.totalDiscount = sale.discounts.find(d => d.type === DiscountType.TotalDiscount);
        this.totalLineItemDiscount = this.getLineItemTotalDiscount(sale.lineItems);
        console.log(this.totalDiscount);
      });
  }

  ngOnDestroy() {
    this.saleSubscription.unsubscribe();
  }

  addDiscount(discount: Discount) {
    this.store.dispatch(new registerSaleActions.AddTotalLineDiscount(discount));
    this.showDiscountInputs = false;
  }

  removeDiscount() {
    this.store.dispatch(new registerSaleActions.RemoveTotalLineDiscount());
    this.showDiscountInputs = false;
  }

  getLineItemTotalDiscount(lineItems: RegisterSaleLineItem[]): number {
    let total = 0;
    lineItems.forEach(li => total += li.totalDiscount);
    return total;
  }
}
