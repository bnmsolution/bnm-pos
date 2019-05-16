import { Injectable } from '@angular/core';
import { RegisterSale } from 'pos-models';
import * as stringWidth from 'string-width';

import { AppState } from '../core';
import { format } from 'date-fns';


@Injectable()
export class PrinterService {

  constructor(
    private appState: AppState) { }

  sendPrintRequest(sale: RegisterSale) {
    const store = this.appState.currentStore;
    const header1 = `${store.name} ${store.phoneNumber}\\n`;
    const header2 = `${store.address}\\n`;
    const header3 = `${store.representative} ${store.businessNumber}\\n\\n`;
    const header4 = format(new Date(sale.salesDate), 'yyyy-MM-dd HH:mm:ss') + '\\n';
    const header5 = `${this.padString('상품명', 20, false)} ${this.padString('단가', 7)} ${this.padString('수량', 5)} ${this.padString('금액', 7)}\\n`;
    const data = [
      header1,
      header2,
      header3,
      header4,
      header5,
      '-'.repeat(42) + '\\n'];
    sale.lineItems.forEach(li => {
      const name = this.padString(li.name, 20, false);
      const price = this.padString(this.formatNumber(li.finalPrice), 7);
      const qty = this.padString(this.formatNumber(li.quantity), 4);
      const total = this.padString(this.formatNumber(li.finalTotal), 7);
      data.push(`${name} ${price} ${qty} ${total}\\n`);
      li.addons.forEach(ao => data.push(`\\u2515${this.padString(ao.name, 19, false)} ${this.padString(this.formatNumber(ao.price), 7)}\\n`));
    });

    data.push('-'.repeat(42) + '\\n');
    data.push(`${this.padString('과세물품가액', 31, false)} ${this.padString(this.formatNumber(sale.totalTaxablePrice), 10)}\\n`);
    data.push(`${this.padString('부가세', 31, false)} ${this.padString(this.formatNumber(sale.totalTax), 10)}\\n`);
    data.push(`${this.padString('합계', 31, false)} ${this.padString(this.formatNumber(sale.totalPrice), 10)}\\n`);

    console.log(data);
    return data;
  }


  padString(value: string | number, targetLength: number, fromStart = true): string {
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
