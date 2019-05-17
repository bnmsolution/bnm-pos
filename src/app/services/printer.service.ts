import { Injectable } from '@angular/core';
import { RegisterSale, RegisterSaleLineItem, DiscountType, DiscountCalculateMethod, DiscountMethod } from 'pos-models';
import * as stringWidth from 'string-width';

import { AppState } from '../core';
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { BXLTextAlignment, BXLTextAttribue, BXLTextSize } from '../shared/enums/printer';
import { paymentTypeString } from '../shared/enums/register-sale';

/* tslint:disable */

const headerStyle = [BXLTextAlignment.Center, BXLTextAttribue.Default, BXLTextSize.W0 | BXLTextSize.H0];
const normalStyle = [BXLTextAlignment.Left, BXLTextAttribue.Default, BXLTextSize.W0 | BXLTextSize.H0];

@Injectable()
export class PrinterService {

  constructor(
    private http: HttpClient,
    private appState: AppState) { }

  sendPrintRequest(sale: RegisterSale) {
    const divider = '-'.repeat(42);
    const store = this.appState.currentStore as any;
    const header1 = `${store.name} ${store.phoneNumber}`;
    const header2 = `${store.address}`;
    const header3 = `${store.representative} ${store.businessNumber}`;
    const dateTime = format(new Date(sale.salesDate), 'yyyy-MM-dd HH:mm:ss');
    const itemsHeader = `${this.format(' 상 품 명', 19, false)} ${this.format('단 가', 8)} ${this.format('수량', 4)} ${this.format('금 액', 8)}`;

    // Header
    let data = [
      [header1, ...headerStyle],
      [header2, ...headerStyle],
      [header3, ...headerStyle],
      ['', ...normalStyle],
      [dateTime, ...normalStyle],
      [divider, ...normalStyle],
      [itemsHeader, ...normalStyle],
      [divider, ...normalStyle]
    ];

    // Line items
    sale.lineItems.forEach(li => {
      const name = this.format(li.name, 19, false);
      const price = this.format(this.formatNumber(li.finalPrice), 8);
      const qty = this.format(this.formatNumber(li.quantity), 4);
      const total = this.format(this.formatNumber(li.finalTotal), 8);
      data.push([`${name} ${price} ${qty} ${total}`, ...normalStyle]);
      li.addons.forEach(ao => data.push([` ㄴ${this.format(ao.name, 17, false)} ${this.format(this.formatNumber(ao.price), 7)}`, ...normalStyle]));
      const discounts = this.generateDiscountLines(li);
      data = data.concat(discounts);
    });

    // Totals
    data.push([divider, ...normalStyle]);
    data.push([`${this.format('과세 물품가액', 31, false)} ${this.format(this.formatNumber(sale.totalTaxablePrice), 10)}`, ...normalStyle]);
    data.push([`${this.format('부가세', 31, false)} ${this.format(this.formatNumber(sale.totalTax), 10)}`, ...normalStyle]);
    data.push([`${this.format('합계', 31, false)} ${this.format(this.formatNumber(sale.totalPrice), 10)}`, ...normalStyle]);
    data.push([`${this.format('할인금액', 31, false)} ${this.format(this.formatNumber(sale.totalDiscount), 10)}`, ...normalStyle]);
    data.push([divider, ...normalStyle]);

    // Payments
    sale.payments.forEach(p => {
      data.push([`${this.format(paymentTypeString[p.paymentType], 31, false)} ${this.format(this.formatNumber(p.amount), 10)}`, ...normalStyle]);
    });


    // Customer
    if (sale.customer) {
      data.push([divider, ...normalStyle]);
      data.push(['마이 포인트 내역', ...headerStyle]);
      data.push([`${this.format('적립 포인트', 31, false)} ${this.format(this.formatNumber(sale.pointsEarned), 10)}`, ...normalStyle]);
      data.push([`${this.format('잔여 포인트', 31, false)} ${this.format(this.formatNumber(sale.totalCustomerPoint), 10)}`, ...normalStyle]);
      data.push([`${this.format('사용가능 포인트', 31, false)} ${this.format(this.formatNumber(sale.totalCustomerPoint), 10)}`, ...normalStyle]);
    }

    this.http.post('http://localhost:53016/api/values', { data }).subscribe();

    console.log(data);
    return data;
  }

  generateDiscountLines(lineItem: RegisterSaleLineItem) {
    return lineItem.discounts.map(d => {
      if (d.calculateMethod === DiscountCalculateMethod.ApplyToEachQuantity) {
        const totalDiscount = -d.amount * lineItem.quantity;
        if (d.method === DiscountMethod.FixedAmount) {
          return [`${this.format(` ㄴ할인`, 17, false)} ${this.format(this.formatNumber(totalDiscount), 7)}`, ...normalStyle];
        } else {
          return [`${this.format(` ㄴ할인 ${d.percentage}%`, 17, false)} ${this.format(this.formatNumber(totalDiscount), 7)}`, ...normalStyle];
        }
      } else {
        if (d.method === DiscountMethod.FixedAmount) {
          return [`${this.format(` ㄴ할인`, 17, false)} ${this.format(this.formatNumber(-d.amount), 7)}`, ...normalStyle];
        } else {
          return [`${this.format(` ㄴ할인 ${d.percentage}%`, 17, false)} ${this.format(this.formatNumber(-d.amount), 7)}`, ...normalStyle];
        }
      }
    });
  }


  format(value: string | number, targetLength: number, fromStart = true): string {
    value = value + '';
    let str = this.subStr(value, targetLength);
    const numPad = targetLength - stringWidth(str);
    if (fromStart) {
      str = ' '.repeat(numPad) + str;
    } else {
      str = str + ' '.repeat(numPad);
    }
    return str;
  }

  subStr(str: string, targetLength: number): string {
    while (stringWidth(str) > targetLength) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  }

  formatNumber(value: number | string = ''): string {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    return val.toLocaleString(this.appState.currentStore.locale);
  }
}
