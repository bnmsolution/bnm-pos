import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegisterSale, getTotalTaxablePrice, PaymentType, PosStore } from 'pos-models';

import * as registerSaleActions from '../../../stores/actions/register-sale.actions';
import { AppState } from 'src/app/core';

@Component({
  selector: 'app-receipt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
  @Input() sale: RegisterSale;
  getTotalTaxablePrice = getTotalTaxablePrice;

  constructor(
    private store: Store<any>,
    private appState: AppState) {
  }

  get currentStore(): PosStore {
    return this.appState.currentStore;
  }

  // Temporary code
  getTypeNameKo(paymentType: PaymentType) {
    switch (paymentType) {
      case PaymentType.Cash:
        return '현금';
      case PaymentType.CreditCard:
        return '신용카드';
      case PaymentType.GiftCard:
        return '기프트카드';
      case PaymentType.StorePoint:
        return '포인트';
    }
  }

  trackByFnction(index) {
    return index;
  }

  removePayment(paymentId: string) {
    this.store.dispatch(new registerSaleActions.RemovePayment({ id: paymentId }));
  }
}
