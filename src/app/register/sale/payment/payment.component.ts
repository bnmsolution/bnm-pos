import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { RegisterSale, RegisterSaleStatus, PaymentType, getCashPaymentOptions } from 'pos-models';

import { getOptions } from 'src/app/shared/config/currency-mask.config';

@Component({
  selector: 'app-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnChanges {
  @Input() sale: RegisterSale;
  @Output() pay = new EventEmitter();
  @Output() close = new EventEmitter<any>();

  amountToPay: any;
  numericPadValue: any = '';
  showNumericPad = false;
  paymentType = PaymentType;
  currencyMaskOptions = getOptions;

  get buttonColor() {
    if (this.sale && this.sale.status === RegisterSaleStatus.Return) {
      return 'warn';
    }
    return 'primary';
  }

  ngOnChanges(simpleChange) {
    if (this.sale) {
      this.amountToPay = this.sale.balance;
      this.numericPadValue = this.amountToPay;
    }
  }

  needPayOrRefund(): boolean {
    if (this.sale) {
      return this.sale.balance !== 0;
    }
    return false;
  }

  addPayment(paymentType: PaymentType) {
    this.pay.emit({
      amount: this.amountToPay,
      type: paymentType
    });
  }

  addQuickCashPayment(amount: number) {
    this.pay.emit({
      amount,
      type: PaymentType.Cash
    });
  }

  isRegularSalePaymentCompleted(): boolean {
    return this.sale && this.sale.status === RegisterSaleStatus.Open && this.sale.balance === 0;
  }


  getAvailablePoints(): number {
    if (this.sale && this.sale.customer) {
      const pointsUsed = this.sale.payments
        .filter(p => p.paymentType === PaymentType.StorePoint)
        .map(p => p.amount)
        .reduce((acc, cur) => acc + cur, 0);
      return this.sale.customer.currentStorePoint - pointsUsed;
    } else {
      return 0;
    }
  }

  isReturnSalePaymentCompleted(): boolean {
    return this.sale.status === RegisterSaleStatus.Return && this.sale.balance === 0;
  }

  toggleNumericPad() {
    this.showNumericPad = !this.showNumericPad;
  }


  getQuickCashPayOptions() {
    return getCashPaymentOptions(this.amountToPay);
  }

  // isExchangePaymentCompleted(): boolean {
  //   return this.currentSale.status === RegisterSaleStatus.Exchange && !this.hasBalance();
  // }

  // hasBalance(): boolean {
  //   return this.currentSale.getBalance() !== 0;
  // }
}
