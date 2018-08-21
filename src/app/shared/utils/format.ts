import {format} from 'date-fns/esm';
import {ko} from 'date-fns/esm/locale';

declare const window: any;
const locales = {ko};

export default function (date, formatStr) {
  return format(date, formatStr, {
    locale: locales[window.__localeId__]
  });
}
