import { Pipe, PipeTransform } from '@angular/core';
import { AppState } from '../../../services/app.service';

const PADDING = '000000';

@Pipe({
  name: 'appCurrency'
})
export class AppCurrencyPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor(private appState: AppState) {
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
  }

  transform(value: number | string = '', fractionSize = 0, displaySymbol = false): string {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    // const isNegative = typeof value === 'number' ? value < 0 : parseFloat(value) < 0;
    // let [integer, fraction = ''] = value.toString()
    //   .split(this.DECIMAL_SEPARATOR);

    // fraction = fractionSize > 0
    //   ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
    //   : '';

    // integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

    if (this.appState.currentStore.displayCurrencySymbol || displaySymbol) {
      return val.toLocaleString(this.appState.currentStore.locale,
        { style: 'currency', currency: this.appState.currentStore.currencyCode });
    } else {
      return val.toLocaleString(this.appState.currentStore.locale);
    }
  }

  parse(value = '', fractionSize = 0): string {
    let [integer, fraction = ''] = value.split(this.DECIMAL_SEPARATOR);

    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : '';

    return integer + fraction;
  }

}
