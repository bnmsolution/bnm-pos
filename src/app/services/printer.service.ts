import { Injectable } from '@angular/core';
import { RegisterSale } from 'pos-models';
import * as stringWidth from 'string-width';

import { AppState } from '../core';
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PrinterService {

  constructor(
    private http: HttpClient,
    private appState: AppState) { }

  sendPrintRequest(sale: RegisterSale) {
    const store = this.appState.currentStore as any;
    const header1 = `${store.name} ${store.phoneNumber}`;
    const header2 = `${store.address}`;
    const header3 = `${store.representative} ${store.businessNumber}`;
    const header4 = format(new Date(sale.salesDate), 'yyyy-MM-dd HH:mm:ss');
    const header5 = `${this.padString(' 상 품 명', 19, false)} ${this.padString('단 가', 8)} ${this.padString('수량', 4)} ${this.padString('금 액', 8)}`;
    const data = [
      header1,
      header2,
      header3,
      '',
      header4,
      '-'.repeat(42) + '',
      header5,
      '-'.repeat(42) + ''];
    sale.lineItems.forEach(li => {
      const name = this.padString(li.name, 19, false);
      const price = this.padString(this.formatNumber(li.finalPrice), 8);
      const qty = this.padString(this.formatNumber(li.quantity), 4);
      const total = this.padString(this.formatNumber(li.finalTotal), 8);
      data.push(`${name} ${price} ${qty} ${total}`);
      li.addons.forEach(ao => data.push(` ㄴ${this.padString(ao.name, 17, false)} ${this.padString(this.formatNumber(ao.price), 7)}`));
    });

    data.push('-'.repeat(42) + '');
       data.push(`${this.padString('과세 물품가액', 31, false)} ${this.padString(this.formatNumber(sale.totalTaxablePrice), 10)}`);
    data.push(`${this.padString('부가세', 31, false)} ${this.padString(this.formatNumber(sale.totalTax), 10)}`);
    data.push(`${this.padString('합계', 31, false)} ${this.padString(this.formatNumber(sale.totalPrice), 10)}`);
    console.log(data);

    this.http.post('http://localhost:53016/api/values', {data}).subscribe();
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
