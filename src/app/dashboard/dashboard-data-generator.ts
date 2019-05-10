import { isWithinInterval, getHours, getDate, setHours, getYear, getMonth, differenceInCalendarMonths, addMonths, format } from 'date-fns';
import { RegisterSaleStatus, RegisterSale, PaymentType } from 'pos-models';

import { Period, getPeriodDates, FilterPeriod } from '../shared/utils/filter-period';
import { ReportLine, generateSalesGroupData, filterPeriodToGroup } from '../report/group-data-generator';
import { DateTimeGroup } from '../shared/enums/date-time-groups';

enum DataType {
  Sales, Customer
}

export interface DashboardData {
  sales: {
    current: {
      data: any,
      count: number,
      total: number,
      avg: number
    },
    previous: {
      data: any,
      count: number,
      total: number,
      avg: number
    },
    diff: {
      count: number,
      total: number,
      avg: number
    }
  };
  payments: {
    current: {
      cash: number,
      creditCard: number,
      points: number
    },
    previous: {
      cash: number,
      creditCard: number,
      points: number,
    },
    diff: {
      cash: number,
      creditCard: number,
      points: number,
    }
  };
  customers: {
    current: {
      data: any,
      newCustomerCount: number,
      returningCustomerCount: number,
      nonCustomerCount: number,
      newCustomerSales: number,
      returningCustomerSales: number,
      nonCustomerSales: number
    },
    previous: {
      data: any,
      newCustomerCount: number,
      returningCustomerCount: number,
      nonCustomerCount: number,
      newCustomerSales: number,
      returningCustomerSales: number,
      nonCustomerSales: number
    },
    diff: {
      newCustomerCount: number,
      returningCustomerCount: number,
      nonCustomerCount: number,
      newCustomerSales: number,
      returningCustomerSales: number,
      nonCustomerSales: number
    }
  };
}


export const generateDashboardData = (period: Period, filterPeriod: FilterPeriod, sales: RegisterSale[]): DashboardData => {
  const { startDate, endDate, prevStartDate, prevEndDate } = period;
  const dashboardData = getEmptyDashboardData();
  dashboardData.sales.current.data = createEmptyDataMap(filterPeriod, startDate, endDate, DataType.Sales);
  dashboardData.sales.previous.data = createEmptyDataMap(filterPeriod, prevStartDate, prevEndDate, DataType.Sales);
  dashboardData.customers.current.data = createEmptyDataMap(filterPeriod, startDate, endDate, DataType.Customer);
  dashboardData.customers.previous.data = createEmptyDataMap(filterPeriod, prevStartDate, prevEndDate, DataType.Customer);

  sales.forEach(s => {
    if (s.status === RegisterSaleStatus.Completed) {
      const isInCurrentPeriod = isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) });
      const isInPreviousPeriod = isWithinInterval(new Date(s.salesDate), { start: new Date(prevStartDate), end: new Date(prevEndDate) });
      const dataKey = generateDataKey(s.salesDate, filterPeriod);
      let salesData;
      let paymentsData;
      let customerData;

      if (isInCurrentPeriod) {
        salesData = dashboardData.sales.current;
        paymentsData = dashboardData.payments.current;
        customerData = dashboardData.customers.current;
      }

      if (isInPreviousPeriod) {
        salesData = dashboardData.sales.previous;
        paymentsData = dashboardData.payments.previous;
        customerData = dashboardData.customers.previous;
      }

      if (salesData) {
        salesData.data[dataKey].total += s.totalPrice;
        salesData.data[dataKey].count++;
        salesData.data[dataKey].avg = salesData.data[dataKey].total / salesData.data[dataKey].count;
        salesData.count++;
        salesData.total += s.totalPrice;
        salesData.avg = salesData.total / salesData.count;
      }

      if (paymentsData) {
        s.payments.forEach(p => {
          switch (p.paymentType) {
            case PaymentType.Cash: {
              paymentsData.cash += p.amount;
              break;
            }
            case PaymentType.CreditCard: {
              paymentsData.creditCard += p.amount;
              break;
            }
            case PaymentType.GiftCard: {
              paymentsData.giftCard += p.amount;
              break;
            }
            case PaymentType.StorePoint: {
              paymentsData.points += p.amount;
              break;
            }
          }
        });
      }

      if (customerData) {
        if (s.isNewCustomer) {
          customerData.data[dataKey].newCustomerCount++;
          customerData.data[dataKey].newCustomerSales += s.totalPrice;
          customerData.newCustomerCount++;
          customerData.newCustomerSales += s.totalPrice;
        } else if (s.customerId) {
          customerData.data[dataKey].returningCustomerCount++;
          customerData.data[dataKey].returningCustomerSales += s.totalPrice;
          customerData.returningCustomerCount++;
          customerData.returningCustomerSales += s.totalPrice;
        } else {
          customerData.data[dataKey].nonCustomerCount++;
          customerData.data[dataKey].nonCustomerSales += s.totalPrice;
          customerData.nonCustomerCount++;
          customerData.nonCustomerSales += s.totalPrice;
        }
      }
    }
  });

  calculateDiffsAndRates(dashboardData);

  console.log(dashboardData);

  return dashboardData;
};

const calculateDiffsAndRates = (data: DashboardData) => {
  data.sales.diff.count = calcChangeRateData(data.sales.current.count, data.sales.previous.count);
  data.sales.diff.total = calcChangeRateData(data.sales.current.total, data.sales.previous.total);
  data.sales.diff.avg = calcChangeRateData(data.sales.current.avg, data.sales.previous.avg);

  data.payments.diff.cash = calcChangeRateData(data.payments.current.cash, data.payments.previous.cash);
  data.payments.diff.creditCard = calcChangeRateData(data.payments.current.creditCard, data.payments.previous.creditCard);
  data.payments.diff.points = calcChangeRateData(data.payments.current.points, data.payments.previous.points);

  data.customers.diff.newCustomerCount =
    calcChangeRateData(data.customers.current.newCustomerCount, data.customers.previous.newCustomerCount);
  data.customers.diff.returningCustomerCount =
    calcChangeRateData(data.customers.current.returningCustomerCount, data.customers.previous.returningCustomerCount);
  data.customers.diff.nonCustomerCount =
    calcChangeRateData(data.customers.current.nonCustomerCount, data.customers.previous.nonCustomerCount);
  data.customers.diff.newCustomerSales =
    calcChangeRateData(data.customers.current.newCustomerSales, data.customers.previous.newCustomerSales);
  data.customers.diff.returningCustomerSales =
    calcChangeRateData(data.customers.current.returningCustomerSales, data.customers.previous.returningCustomerSales);
  data.customers.diff.nonCustomerSales =
    calcChangeRateData(data.customers.current.nonCustomerSales, data.customers.previous.nonCustomerSales);
};

const getEmptyDashboardData = (): DashboardData => {
  return {
    sales: {
      current: {
        data: null,
        count: 0,
        total: 0,
        avg: 0
      },
      previous: {
        data: null,
        count: 0,
        total: 0,
        avg: 0
      },
      diff: {
        count: 0,
        total: 0,
        avg: 0
      }
    },
    payments: {
      current: {
        cash: 0,
        creditCard: 0,
        points: 0
      },
      previous: {
        cash: 0,
        creditCard: 0,
        points: 0,
      },
      diff: {
        cash: 0,
        creditCard: 0,
        points: 0
      }
    },
    customers: {
      current: {
        data: null,
        newCustomerCount: 0,
        returningCustomerCount: 0,
        nonCustomerCount: 0,
        newCustomerSales: 0,
        returningCustomerSales: 0,
        nonCustomerSales: 0
      },
      previous: {
        data: null,
        newCustomerCount: 0,
        returningCustomerCount: 0,
        nonCustomerCount: 0,
        newCustomerSales: 0,
        returningCustomerSales: 0,
        nonCustomerSales: 0
      },
      diff: {
        newCustomerCount: 0,
        returningCustomerCount: 0,
        nonCustomerCount: 0,
        newCustomerSales: 0,
        returningCustomerSales: 0,
        nonCustomerSales: 0
      }
    }
  };
};

const createEmptyDataMap = (filterPeriod: FilterPeriod, start: Date, end: Date, type: DataType) => {
  const dateTimeGroup = filterPeriodToGroup(filterPeriod);
  const mintueInMilliseconds = 60000;
  const dayInMilliseconds = 86400000;
  const timeZoneOffset = new Date().getTimezoneOffset() * mintueInMilliseconds;
  const dataMap = {};

  let startIndex, endIndex;

  switch (dateTimeGroup) {
    case DateTimeGroup.ByHour: {
      for (let i = 0; i < 24; i++) {
        const timestamp = setHours(new Date(start), i).getTime();
        setEmptyData(type, dataMap, i, timestamp);
      }
      break;
    }

    case DateTimeGroup.ByDay:
    case DateTimeGroup.ByDate: {
      startIndex = Math.floor(new Date(start).getTime() / dayInMilliseconds);
      endIndex = Math.floor(new Date(end).getTime() / dayInMilliseconds);

      for (let i = startIndex; i < endIndex; i++) {
        const timestamp = i * dayInMilliseconds + timeZoneOffset;
        const dataKey = generateDataKey(timestamp, filterPeriod);
        setEmptyData(type, dataMap, dataKey, timestamp);
      }
      break;
    }

    case DateTimeGroup.ByMonth: {
      const monthsDiff = differenceInCalendarMonths(new Date(end), new Date(start));
      for (let i = 0; i <= monthsDiff; i++) {
        const timestamp = addMonths(new Date(start), i).getTime();
        const dataKey = generateDataKey(timestamp, filterPeriod);
        setEmptyData(type, dataMap, dataKey, timestamp);
      }
      break;
    }

    case DateTimeGroup.ByYear: {
      const startYear = getYear(new Date(start));
      const endYear = getYear(new Date(end));
      for (let i = startYear; i <= endYear; i++) {
        const timestamp = new Date(`${i}-12-31`).getTime();
        const dataKey = generateDataKey(timestamp, filterPeriod);
        setEmptyData(type, dataMap, dataKey, timestamp);
      }
    }
  }

  return dataMap;
};

const setEmptyData = (type: DataType, dataMap: object, dataKey: string | number, timestamp: number) => {
  const v = timestamp > Date.now() ? null : 0;
  switch (type) {
    case DataType.Sales: {
      dataMap[dataKey] = {
        total: v,
        avg: v,
        count: v,
        timestamp
      };
      break;
    }
    case DataType.Customer: {
      dataMap[dataKey] = {
        newCustomerCount: v,
        returningCustomerCount: v,
        nonCustomerCount: v,
        newCustomerSales: v,
        returningCustomerSales: v,
        nonCustomerSales: v,
        timestamp
      };
      break;
    }
  }
};

const generateDataKey = (date: Date | number | string, filterPeriod: FilterPeriod): string => {
  // date = new Date(date);
  switch (filterPeriod) {
    case FilterPeriod.Today:
    case FilterPeriod.Yesterday: {
      return getHours(new Date(date)) + '';
    }
    case FilterPeriod.ThisWeek:
    case FilterPeriod.LastWeek:
    case FilterPeriod.ThisMonth:
    case FilterPeriod.LastMonth:
    case FilterPeriod.OneWeek:
    case FilterPeriod.ThrityDays: {
      return format(new Date(date), 'yyyy-M-dd');
    }
    case FilterPeriod.ThisYear:
    case FilterPeriod.LastYear:
    case FilterPeriod.OneYear: {
      return format(new Date(date), 'yyyy-M');
    }
  }
};

const calcChangeRateData = (current: number, previous: number): number => {
  return previous ? (current - previous) / previous * 100 : null;
};
