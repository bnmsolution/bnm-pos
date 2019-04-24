import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns';

export interface Period {
  startDate: Date;
  endDate: Date;
}

export enum FilterPeriod {
  All, Today, Yesterday, ThisWeek, LastWeek, ThisMonth, LastMonth, ThisYear, LastYear, OneWeek, OneMonth, OneYear, Custom
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
    case FilterPeriod.Yesterday: {
      const yesterday = subDays(today, 1);
      startDate = startOfDay(yesterday);
      endDate = endOfDay(subDays(today, 1));
      break;
    }
    case FilterPeriod.ThisWeek: {
      startDate = startOfWeek(today);
      endDate = endOfWeek(today);
      break;
    }
    case FilterPeriod.LastWeek: {
      const lastWeek = subWeeks(today, 1);
      startDate = startOfWeek(lastWeek);
      endDate = endOfWeek(lastWeek);
      break;
    }
    case FilterPeriod.ThisMonth: {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      break;
    }
    case FilterPeriod.LastMonth: {
      const lastMonth = subMonths(today, 1);
      startDate = startOfMonth(lastMonth);
      endDate = endOfMonth(lastMonth);
      break;
    }
    case FilterPeriod.ThisYear: {
      startDate = startOfYear(today);
      endDate = endOfYear(today);
      break;
    }
    case FilterPeriod.LastYear: {
      const lastYear = subYears(today, 1);
      startDate = startOfYear(lastYear);
      endDate = endOfYear(lastYear);
      break;
    }
    case FilterPeriod.OneWeek: {
      endDate = endOfDay(today);
      startDate = startOfDay(subDays(today, 6));
      break;
    }
    case FilterPeriod.OneMonth: {
      endDate = endOfDay(today);
      startDate = subMonths(endDate, 1);
      break;
    }
    case FilterPeriod.OneYear: {
      endDate = endOfDay(today);
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
