// import { format } from 'date-fns/esm';
// import { ko } from 'date-fns/esm/locale';
import * as moment from 'moment';

declare const window: any;
// const locales = { ko };

export default function (date, formatStr) {
  // return format(date, formatStr, {
  //   locale: locales[window.__localeId__],
  //   awareOfUnicodeTokens: true
  // });

  const m = moment(date);
  if (formatStr) {
    return m.format(formatStr);
  } else {
    return m.format(this.appState.currentStore.dateFormat);
  }
}
