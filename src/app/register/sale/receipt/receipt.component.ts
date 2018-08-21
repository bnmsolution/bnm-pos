import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {RegisterSale, getTotalTaxablePrice, getTotalTaxFreePrice, PaymentType} from 'pos-models';

@Component({
  selector: 'app-receipt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
  @Input() sale: RegisterSale;
  getTotalTaxablePrice = getTotalTaxablePrice;
  getTotalTaxFreePrice = getTotalTaxFreePrice;

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
}
