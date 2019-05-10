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
  prevStartDate?: Date;
  prevEndDate?: Date;
}

export enum FilterPeriod {
  All, Today, Yesterday, ThisWeek, LastWeek, ThisMonth, LastMonth, ThisYear, LastYear, OneWeek, ThrityDays, OneYear, Custom
}

export interface FilterPeriodChage {
  period: Period;
  filterPeriod: FilterPeriod;
}

export const getPeriodDates = (period: FilterPeriod): Period => {
  const today = new Date();
  let startDate, endDate, prevStartDate, prevEndDate;
  switch (period) {
    case FilterPeriod.Today:
    case FilterPeriod.Yesterday: {
      const baseDate = period === FilterPeriod.Today ? today : subDays(today, 1);
      startDate = startOfDay(baseDate);
      endDate = endOfDay(baseDate);
      prevStartDate = subDays(startDate, 1);
      prevEndDate = subDays(endDate, 1);
      break;
    }
    case FilterPeriod.ThisWeek:
    case FilterPeriod.LastWeek: {
      const baseDate = period === FilterPeriod.ThisWeek ? today : subWeeks(today, 1);
      startDate = startOfWeek(baseDate);
      endDate = endOfWeek(baseDate);
      prevStartDate = subWeeks(startDate, 1);
      prevEndDate = subWeeks(endDate, 1);
      break;
    }
    case FilterPeriod.ThisMonth:
    case FilterPeriod.LastMonth: {
      const baseDate = period === FilterPeriod.ThisMonth ? today : subMonths(today, 1);
      startDate = startOfMonth(baseDate);
      endDate = endOfMonth(baseDate);
      prevStartDate = subMonths(startDate, 1);
      prevEndDate = endOfMonth(subMonths(endDate, 1));
      break;
    }
    case FilterPeriod.ThisYear:
    case FilterPeriod.LastYear: {
      const baseDate = period === FilterPeriod.ThisYear ? today : subYears(today, 1);
      startDate = startOfYear(baseDate);
      endDate = endOfYear(baseDate);
      prevStartDate = subYears(startDate, 1);
      prevEndDate = subYears(endDate, 1);
      break;
    }

    case FilterPeriod.OneWeek: {
      endDate = endOfDay(today);
      startDate = startOfDay(subDays(today, 6));
      prevStartDate = subWeeks(startDate, 1);
      prevEndDate = subWeeks(endDate, 1);
      break;
    }
    case FilterPeriod.ThrityDays: {
      endDate = endOfDay(today);
      startDate = startOfDay(subDays(endDate, 29));
      prevEndDate = endOfDay(subDays(startDate, 1));
      prevStartDate = startOfDay(subDays(prevEndDate, 29));
      break;
    }
    case FilterPeriod.OneYear: {
      endDate = endOfDay(today);
      startDate = startOfDay(subDays(endDate, 364));
      prevEndDate = endOfDay(subDays(startDate, 1));
      prevStartDate = startOfDay(subDays(prevEndDate, 364));
      break;
    }
    default: {
      startDate = null;
      endDate = null;
      prevStartDate = null;
      prevEndDate = null;
    }
  }
  return {
    startDate,
    endDate,
    prevStartDate,
    prevEndDate
  };
};
