import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';

export function getOptions(options = {}) {
  const defaultOptions: CurrencyMaskConfig = {
    align: 'left',
    allowNegative: false,
    decimal: '.',
    precision: 0,
    prefix: '',
    suffix: ' 원',
    thousands: ','
  };

  return Object.assign({...defaultOptions}, options);
}
