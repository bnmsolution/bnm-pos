import { Observable } from 'rxjs';
import { RegisterSale } from 'pos-models';
import { isWithinInterval } from 'date-fns';

import { Period } from '../utils/filter-period';

export const filterSalesByPeriod = (period: Period) => <T>(source: Observable<RegisterSale[]>) => {
  return new Observable<RegisterSale[]>(observer => {
    return source.subscribe({
      next(sales) {
        const { startDate, endDate } = period;
        let filteredSales = sales;
        if (sales !== null && startDate && endDate) {
          filteredSales = sales.filter(s =>
            isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) }));
        }
        observer.next(filteredSales);
      },
      error(err) { observer.error(err); },
      complete() { observer.complete(); }
    });
  });
};

export const _filterSalesByPeriod = (period: Period, sales: RegisterSale[]) => {
  const { startDate, endDate } = period;
  let filteredSales = sales;

  if (startDate && endDate) {
    filteredSales = sales.filter(s =>
      isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) }));
  }

  return filteredSales;
};
