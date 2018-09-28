import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks, subYears
} from 'date-fns';

export interface Period {
  startDate: Date;
  endDate: Date;
}

export enum FilterPeriod {
  All, Today, ThisWeek, ThisMonth, ThisYear, OneWeek, OneMonth, OneYear, Custom
}

export const getPeriodDates = (period: FilterPeriod): Period => {
  const today = new Date();
  let startDate, endDate;
  switch (period) {
    case FilterPeriod.Today: {
      startDate = startOfDay(today);
      endDate = endOfDay(today);
      break;
    }
    case  FilterPeriod.ThisWeek: {
      startDate = startOfWeek(today);
      endDate = endOfWeek(today);
      break;
    }
    case FilterPeriod.ThisMonth: {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      break;
    }
    case FilterPeriod.ThisYear: {
      startDate = startOfYear(today);
      endDate = endOfYear(today);
      break;
    }
    case FilterPeriod.OneWeek: {
      endDate = startOfDay(today);
      startDate = subWeeks(endDate, 1);
      break;
    }
    case FilterPeriod.OneMonth: {
      endDate = startOfDay(today);
      startDate = subMonths(endDate, 1);
      break;
    }
    case FilterPeriod.OneYear: {
      endDate = startOfDay(today);
      startDate = subYears(endDate, 1);
      break;
    }
    default: {
      startDate = null;
      endDate = null;
    }
  }
  return {
    startDate,
    endDate
  };
};
