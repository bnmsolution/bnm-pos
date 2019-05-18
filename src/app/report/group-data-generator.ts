import { getHours, getDay, getYear, getMonth, getQuarter, format } from 'date-fns';
import { RegisterSale } from 'pos-models';

import { DateTimeGroup } from 'src/app/shared/enums/date-time-groups';
import { FilterPeriod } from '../shared/utils/filter-period';

const dayInMilliseconds = 86400000;

export interface ReportLine {
  index: number;
  label: string;
}

export const generateSalesGroupData = (groupValue: DateTimeGroup, sales: RegisterSale[], getDefaultLine: () => ReportLine,
  accumulateFn: (reportLine: ReportLine, sale: RegisterSale) => void, isdescending = false) => {
  switch (groupValue) {
    case DateTimeGroup.ByHour: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesDate = new Date(sale.salesDate);
        return { key: getHours(salesDate) };
      }, accumulateFn, isdescending);
    }

    case DateTimeGroup.ByDay: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesDate = new Date(sale.salesDate);
        return { key: getDay(salesDate) };
      }, accumulateFn, isdescending);
    }

    case DateTimeGroup.ByDate: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesTimestamp = new Date(sale.salesDate).getTime();
        return { key: format(new Date(sale.salesDate), 'yyyy-M-dd'), label: salesTimestamp, index: salesTimestamp };
      }, accumulateFn, isdescending);
    }

    case DateTimeGroup.ByMonth: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesTimestamp = new Date(sale.salesDate).getTime();
        const salesDate = new Date(sale.salesDate);
        const salesYear = getYear(salesDate);
        const salesMonth = getMonth(salesDate);
        return { key: parseFloat(`${salesYear}.${salesMonth}`), label: `${salesYear}년 ${salesMonth + 1}월`, index: salesTimestamp };
      }, accumulateFn, isdescending);
    }

    case DateTimeGroup.ByQuarter: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesTimestamp = new Date(sale.salesDate).getTime();
        const salesDate = new Date(sale.salesDate);
        const salesYear = getYear(salesDate);
        const salesQuarter = getQuarter(salesDate);
        return { key: parseFloat(`${salesYear}.${salesQuarter}`), label: `${salesYear}년 ${salesQuarter}분기`, index: salesTimestamp };
      }, accumulateFn, isdescending);
    }

    case DateTimeGroup.ByYear: {
      return generateGroupData(groupValue, sales, getDefaultLine, (sale) => {
        const salesDate = new Date(sale.salesDate);
        const salesYear = getYear(salesDate);
        return { key: salesYear, label: `${salesYear}년`, index: salesYear };
      }, accumulateFn, isdescending);
    }
  }
};

export function generateGroupData<T>(groupValue: DateTimeGroup, items: T[], getDefaultLine: () => ReportLine,
  keyAndLabelFn: (item: T) => { key: any, label?: any, index?: any },
  accumulateFn: (reportLine: ReportLine, item: T) => void, isdescending: boolean) {

  switch (groupValue) {
    case DateTimeGroup.ByHour: {
      const hourlyGroups = [];

      for (let i = 0; i < 24; i++) {
        const dataLine = getDefaultLine();
        dataLine.index = i;
        dataLine.label = i + '시';
        hourlyGroups.push(dataLine);
      }

      items.forEach(item => {
        const groupDataIndex = keyAndLabelFn(item).key;
        const reportLine = hourlyGroups[groupDataIndex];
        accumulateFn(reportLine, item);
      });
      return hourlyGroups;
    }

    case DateTimeGroup.ByDay: {
      const daysGroup = [];
      const daysString = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

      for (let i = 0; i < 7; i++) {
        const dataLine = getDefaultLine();
        dataLine.index = i;
        dataLine.label = daysString[i];
        daysGroup.push(dataLine);
      }

      items.forEach(item => {
        const groupDataIndex = keyAndLabelFn(item).key;
        const reportLine = daysGroup[groupDataIndex];
        accumulateFn(reportLine, item);
      });
      return daysGroup;
    }

    case DateTimeGroup.ByDate:
    case DateTimeGroup.ByMonth:

    case DateTimeGroup.ByQuarter:
    case DateTimeGroup.ByYear: {
      const groups = {};

      items.forEach(item => {
        const { key, label, index } = keyAndLabelFn(item);
        let reportLine = groups[key];
        if (groups[key]) {
          reportLine = groups[key];
        } else {
          reportLine = getDefaultLine();
          reportLine.index = index;
          reportLine.label = label;
          groups[key] = reportLine;
        }
        accumulateFn(reportLine, item);
      });

      return Object.values(groups).sort((a: any, b: any) => isdescending ? b.index - a.index : a.index - b.index);
    }
  }
}

export const filterPeriodToGroup = (period: FilterPeriod): DateTimeGroup => {
  switch (period) {
    case FilterPeriod.Today:
    case FilterPeriod.Yesterday: {
      return DateTimeGroup.ByHour;
    }
    case FilterPeriod.ThisWeek:
    case FilterPeriod.LastWeek:
    case FilterPeriod.OneWeek: {
      return DateTimeGroup.ByDay;
    }
    case FilterPeriod.ThisMonth:
    case FilterPeriod.LastMonth:
    case FilterPeriod.ThrityDays: {
      return DateTimeGroup.ByDate;
    }
    case FilterPeriod.ThisYear:
    case FilterPeriod.LastYear:
    case FilterPeriod.OneYear: {
      return DateTimeGroup.ByMonth;
    }
  }
};

